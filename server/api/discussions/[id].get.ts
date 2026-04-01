import {Discussion, User, Post, Media} from '../../utils/db';
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
    for (const post of result.posts) {
      if (post.content) {
        post.content = parse(post.content);
      }
    }
  }

  return result;
});
