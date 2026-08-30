import {Discussion, User} from '../../utils/db';
import {FlarumDiscussion, FlarumUser} from '../../utils/flarumDb';

export default defineEventHandler(async () => {
  const currentDiscussionsPromise = Discussion.findAll({
    order: [
      ['updatedAt', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    include: User,
  }).then((rows) => rows.map((r) => r.toJSON()));

  const legacyDiscussionsPromise = FlarumDiscussion.findAll({
    where: {
      isPrivate: false,
      isApproved: true,
      hiddenAt: null,
    },
    order: [
      ['lastPostedAt', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    include: [
      {
        model: FlarumUser,
        as: 'user',
      },
    ],
  }).then((rows) =>
    rows.map((d) => {
      const u = d.user;
      return {
        id: `nex-${d.id}`,
        name: d.title,
        userId: d.userId ? `nex-${d.userId}` : 'unknown',
        lastMessageId: d.lastPostId ? `nex-${d.lastPostId}` : '',
        messageCount: d.commentCount ?? 0,
        memberCount: d.participantCount ?? 0,
        createdAt: d.createdAt,
        updatedAt: d.lastPostedAt || d.createdAt,
        user: {
          id: u ? `nex-${u.id}` : 'unknown',
          username: u ? u.username : 'Unknown User',
          displayName: u ? u.username : 'Unknown User',
          avatarHash: u?.avatarUrl || '',
        },
      };
    }),
  ).catch((e) => {
    console.error('Failed to fetch legacy discussions:', e);
    return [];
  });

  const [currentDiscussions, legacyDiscussions] = await Promise.all([
    currentDiscussionsPromise,
    legacyDiscussionsPromise,
  ]);

  const allDiscussions = [...currentDiscussions, ...legacyDiscussions];

  allDiscussions.sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt).getTime();
    return timeB - timeA;
  });

  return allDiscussions;
});

