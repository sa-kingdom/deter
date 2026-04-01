import {Discussion, User} from '../../utils/db';

export default defineEventHandler(async () => {
  const discussions = await Discussion.findAll({
    order: [
      ['updatedAt', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    include: User,
  });

  return discussions;
});
