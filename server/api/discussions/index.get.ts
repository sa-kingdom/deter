import {Discussion, User} from '../../utils/db';
import {
  FlarumDiscussion,
  FlarumUser,
  FlarumTag,
} from '../../utils/flarumDb';
import {COLLECTIONS_MAP} from '../../constants/collections';

export default defineEventHandler(async () => {
  const currentDiscussionsPromise = Discussion.findAll({
    order: [
      ['updatedAt', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    include: User,
  }).then((rows) =>
    rows.map((r) => {
      const data = r.toJSON();
      return {
        ...data,
        collections: [],
        tags: [],
      };
    }),
  );

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
      {
        model: FlarumTag,
        as: 'tags',
      },
    ],
  }).then((rows) =>
    rows.map((d) => {
      const u = d.user;
      const collections = (d.tags || []).map((t) =>
        COLLECTIONS_MAP[t.id] || {
          id: t.id,
          name: t.name,
          slug: t.slug,
          color: t.color,
          icon: t.icon,
        },
      );
      return {
        id: `N${d.id}`,
        name: d.title,
        userId: d.userId ? `N${d.userId}` : 'unknown',
        lastMessageId: d.lastPostId ? `N${d.lastPostId}` : '',
        messageCount: d.commentCount ?? 0,
        memberCount: d.participantCount ?? 0,
        createdAt: d.createdAt,
        updatedAt: d.lastPostedAt || d.createdAt,
        collections,
        tags: collections,
        user: {
          id: u ? `N${u.id}` : 'unknown',
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

