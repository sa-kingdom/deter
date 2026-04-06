import {Discussion, User, Post, Media, Member, Role} from '../../utils/db';
import {parse} from 'discord-markdown-parser';

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
        const memberMatches = post.content.matchAll(/<@!?(\d+)>/g);
        for (const match of memberMatches) memberIds.add(match[1]);
        const roleMatches = post.content.matchAll(/<@&(\d+)>/g);
        for (const match of roleMatches) roleIds.add(match[1]);
      }
    }

    // Fetch member and role names from database
    const [members, roles] = await Promise.all([
      Member.findAll({where: {id: Array.from(memberIds)}}),
      Role.findAll({where: {id: Array.from(roleIds)}}),
    ]);

    const memberMap = new Map(members.map((m) => [m.id, m.displayName]));
    const roleMap = new Map(roles.map((r) => [r.id, r.name]));

    for (const post of result.posts) {
      if (post.content) {
        let content = post.content;
        // Resolve user mentions
        content = content.replace(
            /<@!?(\d+)>/g,
            (match: string, id: string) => {
              const name = memberMap.get(id);
              return name ? `@${name}` : '@未知使用者';
            },
        );
        // Resolve role mentions
        content = content.replace(
            /<@&(\d+)>/g,
            (match: string, id: string) => {
              const name = roleMap.get(id);
              return name ? `@${name}` : '@未知角色';
            },
        );
        // Ensure @everyone and @here are treated as resolved text
        content = content.replace(/@everyone/g, '@everyone');
        content = content.replace(/@here/g, '@here');

        post.content = parse(content);
      }
    }
  }

  return result;
});
