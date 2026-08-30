import {Op} from 'sequelize';
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

const PAGE_SIZE = 20;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const collectionSlug = query.collection ?
    String(query.collection) :
    null;

  // Cursor: ISO timestamp of the oldest item from the previous page.
  // Fetch items with updatedAt strictly before this cursor.
  const beforeCursor = query.before ?
    new Date(String(query.before)) :
    null;

  const limit = query.limit ?
    Math.min(Number(query.limit), 100) :
    PAGE_SIZE;

  const filterCollection = collectionSlug ?
    (COLLECTIONS_BY_SLUG[collectionSlug] ?? null) :
    null;

  // ── Current (Discord-sourced) discussions ────────────────────────
  const currentWhere: Record<string, unknown> = {};
  if (beforeCursor) {
    currentWhere.updatedAt = {[Op.lt]: beforeCursor};
  }

  const currentDiscussionsPromise = collectionSlug ?
    Promise.resolve([]) :
    Discussion.findAll({
      where: currentWhere,
      order: [['updatedAt', 'DESC']],
      limit,
      include: User,
    }).then((rows) =>
      rows.map((r) => {
        const data = r.toJSON();
        return {...data, collections: [], tags: []};
      }),
    );

  // ── Legacy (Flarum) discussions ──────────────────────────────────
  const legacyWhere: Record<string, unknown> = {
    isPrivate: false,
    isApproved: true,
    hiddenAt: null,
  };
  if (beforeCursor) {
    legacyWhere.lastPostedAt = {[Op.lt]: beforeCursor};
  }

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
    order: [['lastPostedAt', 'DESC']],
    limit,
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

  // Merge and sort descending, then take a single page
  const merged = [...currentDiscussions, ...legacyDiscussions];
  merged.sort((a, b) => {
    const tA = new Date(a.updatedAt || a.createdAt).getTime();
    const tB = new Date(b.updatedAt || b.createdAt).getTime();
    return tB - tA;
  });

  const items = merged.slice(0, limit);

  // Next cursor = updatedAt of the last item in this page
  const last = items[items.length - 1];
  const nextCursor = last ?
    (new Date(last.updatedAt || last.createdAt).toISOString()) :
    null;

  // Signal end-of-feed when this page is shorter than requested limit
  const hasMore = items.length >= limit;

  return {items, nextCursor: hasMore ? nextCursor : null};
});
