import {Discussion, User, Post, Media, Member, Role} from '../../utils/db';
import {
  FlarumDiscussion,
  FlarumUser,
  FlarumPost,
} from '../../utils/flarumDb';
import {flarumToDiscordMarkdown} from '../../utils/flarumFormatter';
import {parse} from 'discord-markdown-parser';

const MENTION_USER_REGEX = /<@!?(\d+)>/g;
const MENTION_ROLE_REGEX = /<@&(\d+)>/g;
const UNKNOWN_USER = 'Unknown User';
const UNKNOWN_ROLE = 'Unknown Role';

/**
 * Escapes characters that are special in markdown.
 * @param text - The text to escape.
 * @returns The escaped text.
 */
function escapeMarkdown(text: string): string {
  return text.replace(/[\\*_`~|[\]]/g, '\\$&');
}

export default defineEventHandler(async (event) => {
  const discussionId = getRouterParam(event, 'id');

  if (!discussionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Discussion ID is required',
    });
  }

  // Handle legacy Flarum discussion
  if (discussionId.startsWith('N')) {
    const rawId = discussionId.slice(1);
    const flarumId = parseInt(rawId, 10);
    if (isNaN(flarumId)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Discussion not found',
      });
    }

    const legacyDiscussion = await FlarumDiscussion.findOne({
      where: {
        id: flarumId,
        isPrivate: false,
        isApproved: true,
        hiddenAt: null,
      },
      include: [
        {
          model: FlarumUser,
          as: 'user',
        },
        {
          model: FlarumPost,
          as: 'posts',
          where: {
            isPrivate: false,
            isApproved: true,
            hiddenAt: null,
          },
          required: false,
          include: [
            {
              model: FlarumUser,
              as: 'user',
            },
          ],
        },
      ],
      order: [[{model: FlarumPost, as: 'posts'}, 'createdAt', 'ASC']],
    });

    if (!legacyDiscussion) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Discussion not found',
      });
    }

    const u = legacyDiscussion.user;
    const posts = (legacyDiscussion.posts || []).map((post) => {
      const postUser = post.user;
      const md = flarumToDiscordMarkdown(post.content);
      return {
        id: `N${post.id}`,
        content: parse(md),
        userId: postUser ? `N${postUser.id}` : 'unknown',
        media: [],
        createdAt: post.createdAt,
        updatedAt: post.editedAt || post.createdAt,
        discussionId,
        user: {
          id: postUser ? `N${postUser.id}` : 'unknown',
          username: postUser ? postUser.username : 'Unknown User',
          displayName: postUser ? postUser.username : 'Unknown User',
          avatarHash: postUser?.avatarUrl || '',
        },
      };
    });

    return {
      id: discussionId,
      name: legacyDiscussion.title,
      userId: u ? `N${u.id}` : 'unknown',
      lastMessageId: legacyDiscussion.lastPostId ?
        `N${legacyDiscussion.lastPostId}` :
        '',
      messageCount: legacyDiscussion.commentCount ?? 0,
      memberCount: legacyDiscussion.participantCount ?? 0,
      createdAt: legacyDiscussion.createdAt,
      updatedAt: legacyDiscussion.lastPostedAt || legacyDiscussion.createdAt,
      user: {
        id: u ? `N${u.id}` : 'unknown',
        username: u ? u.username : 'Unknown User',
        displayName: u ? u.username : 'Unknown User',
        avatarHash: u?.avatarUrl || '',
      },
      posts,
    };
  }

  // Handle current Dunya / Discord discussion
  const discussion = await Discussion.findByPk(discussionId, {
    include: [
      User,
      {
        model: Post,
        where: {discussionId},
        order: [['createdAt', 'ASC']],
        include: [User, Media],
      },
    ],
  });

  if (!discussion) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Discussion not found',
    });
  }

  // Parse markdown in posts
  const result = discussion.toJSON();
  if (result.posts) {
    // Collect all unique mention IDs across all posts for batch retrieval
    const memberIds = new Set<string>();
    const roleIds = new Set<string>();
    for (const post of result.posts) {
      if (post.content) {
        const memberMatches = post.content.matchAll(MENTION_USER_REGEX);
        for (const match of memberMatches) memberIds.add(match[1]);
        const roleMatches = post.content.matchAll(MENTION_ROLE_REGEX);
        for (const match of roleMatches) roleIds.add(match[1]);
      }
    }

    // Fetch member and role names from database
    const [members, roles] = await Promise.all([
      memberIds.size > 0 ?
        Member.findAll({where: {id: Array.from(memberIds)}}) :
        [],
      roleIds.size > 0 ?
        Role.findAll({where: {id: Array.from(roleIds)}}) :
        [],
    ]);

    const memberMap = new Map(members.map((m) => [m.id, m.displayName]));
    const roleMap = new Map(roles.map((r) => [r.id, r.name]));

    for (const post of result.posts) {
      if (post.content) {
        let content = post.content;
        // Resolve user mentions
        content = content.replace(
            MENTION_USER_REGEX,
            (_match: string, id: string) => {
              const name = memberMap.get(id);
              return name ? `@${escapeMarkdown(name)}` : `@${UNKNOWN_USER}`;
            },
        );
        // Resolve role mentions
        content = content.replace(
            MENTION_ROLE_REGEX,
            (_match: string, id: string) => {
              const name = roleMap.get(id);
              return name ? `@${escapeMarkdown(name)}` : `@${UNKNOWN_ROLE}`;
            },
        );

        post.content = parse(content);
      }
    }
  }

  return result;
});

