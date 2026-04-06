import {Discussion, User, Post, Media, Member, Role} from '../../utils/db';
import {parse} from 'discord-markdown-parser';

const MENTION_USER_REGEX = /<@!?(\d+)>/g;
const MENTION_ROLE_REGEX = /<@&(\d+)>/g;
const UNKNOWN_USER = 'Unknown User';
const UNKNOWN_ROLE = 'Unknown Role';

/**
 * Escapes characters that are special in markdown.
 * @param text The text to escape.
 * @returns The escaped text.
 */
function escapeMarkdown(text: string): string {
  return text.replace(/[\\*_`~|]/g, '\\$&');
}

export default defineEventHandler(async (event) => {
  const discussionId = getRouterParam(event, 'id');

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
