import {
  COLLECTIONS_MAP,
  COLLECTIONS_BY_SLUG,
  type Collection,
} from '../../constants/collections';
import {
  dunyaFetch,
  type DunyaDiscussion,
  type DunyaFeed,
} from '../../utils/dunya';

const PAGE_SIZE = 20;

/**
 * Map a legacy Flarum tag from the Dunya API into a collection, preferring
 * the locally curated collection metadata.
 * @param tag - Raw tag payload from Dunya.
 * @returns The collection to expose to the frontend.
 */
function toCollection(tag: DunyaDiscussion['tags'][number]): Collection {
  return COLLECTIONS_MAP[tag.id] || {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    color: tag.color,
    icon: tag.icon,
  };
}

/**
 * Map a Dunya feed discussion into the frontend discussion item contract.
 * @param item - Discussion payload from Dunya.
 * @returns The frontend discussion item.
 */
function toFeedItem(item: DunyaDiscussion) {
  if (item.source === 'flarum') {
    const collections = item.tags.map(toCollection);
    return {
      id: `N${item.id}`,
      name: item.name,
      userId: item.authorId ? `N${item.authorId}` : 'unknown',
      lastMessageId: item.lastMessageId ? `N${item.lastMessageId}` : '',
      messageCount: item.messageCount,
      memberCount: item.memberCount,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      collections,
      tags: collections,
      user: {
        id: item.author ? `N${item.author.id}` : 'unknown',
        username: item.author ?
          item.author.username :
          'Unknown User',
        displayName: item.author ?
          item.author.displayName :
          'Unknown User',
        avatarHash: item.author?.avatarHash ?? '',
      },
    };
  }

  return {
    id: item.id,
    name: item.name,
    userId: item.authorId,
    lastMessageId: item.lastMessageId ?? '',
    messageCount: item.messageCount,
    memberCount: item.memberCount,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    collections: [],
    tags: [],
    user: item.author,
  };
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const collectionSlug = query.collection ?
    String(query.collection) :
    null;

  // Cursor: ISO timestamp of the oldest item from the previous page.
  const beforeCursor = query.before ? String(query.before) : null;

  const limit = query.limit ?
    Math.min(Number(query.limit), 100) :
    PAGE_SIZE;

  const filterCollection = collectionSlug ?
    (COLLECTIONS_BY_SLUG[collectionSlug] ?? null) :
    null;

  const params = new URLSearchParams();
  if (beforeCursor) params.set('before', beforeCursor);
  params.set('limit', String(limit));
  // Legacy Flarum tags share IDs with the local collection definitions.
  if (filterCollection) params.set('tag', String(filterCollection.id));

  let feed: DunyaFeed;
  try {
    feed = await dunyaFetch(`/discussions/feed?${params}`) as DunyaFeed;
  } catch (error) {
    console.error('Failed to fetch discussions from Dunya:', error);
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch discussions',
    });
  }

  return {
    items: feed.items.map(toFeedItem),
    nextCursor: feed.nextCursor,
  };
});
