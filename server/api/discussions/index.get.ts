import {Discussion, User} from '../../utils/db';
import {
  FlarumDiscussion,
  FlarumUser,
  FlarumTag,
} from '../../utils/flarumDb';
import {
  COLLECTIONS_MAP,
  COLLECTIONS_BY_SLUG,
} from '../../constants/collections';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const collectionSlug = query.collection ?
    String(query.collection) :
    null;

  const filterCollection = collectionSlug ?
    (COLLECTIONS_BY_SLUG[collectionSlug] ?? null) :
    null;

  const currentDiscussionsPromise = collectionSlug ?
    Promise.resolve([]) :
    Discussion.findAll({
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

  const legacyWhere: Record<string, unknown> = {
    isPrivate: false,
    isApproved: true,
    hiddenAt: null,
  };

  const tagInclude: Record<string, unknown> = {
    model: FlarumTag,
    as: 'tags',
  };
  if (filterCollection) {
    tagInclude.where = {id: filterCollection.id};
    tagInclude.required = true;
  }

  const legacyDiscussionsPromise = FlarumDiscussion.findAll({
    where: legacyWhere,
    order: [
      ['lastPostedAt', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    include: [
      {model: FlarumUser, as: 'user'},
      tagInclude,
    ],
  }).then((rows) =>
    rows.map((d) => {
      const u = d.user;
      const collections = (d.tags || []).map((t) => (
        COLLECTIONS_MAP[t.id] || {
          id: t.id,
          name: t.name,
          slug: t.slug,
          color: t.color,
          icon: t.icon,
        }
      ));
      return {
        id: `N${d.id}`,
        name: d.title,
        userId: d.userId ? `N${d.userId}` : 'unknown',
        lastMessageId: d.lastPostId ?
          `N${d.lastPostId}` :
          '',
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
