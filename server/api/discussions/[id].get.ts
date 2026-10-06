import {parse} from 'discord-markdown-parser';
import {COLLECTIONS_MAP, type Collection} from '../../constants/collections';
import {
  dunyaFetch,
  type DunyaDiscussion,
} from '../../utils/dunya';

const UNKNOWN_USER = 'Unknown User';

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
 * Fetch a discussion payload from the Dunya data API.
 * @param source - The discussion source, either "discord" or "flarum".
 * @param id - The raw discussion ID without the "N" legacy prefix.
 * @returns The discussion payload from Dunya.
 */
async function fetchDiscussion(
    source: 'discord' | 'flarum',
    id: string,
): Promise<DunyaDiscussion> {
  try {
    return await dunyaFetch(`/discussions/${source}/${id}`) as DunyaDiscussion;
  } catch (error) {
    const status = (error as {status?: number}).status;
    if (status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Discussion not found',
      });
    }
    console.error(`Failed to fetch ${source} discussion from Dunya:`, error);
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch discussion',
    });
  }
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
    const detail = await fetchDiscussion('flarum', discussionId.slice(1));
    const collections = detail.tags.map(toCollection);
    const author = detail.author;
    const posts = (detail.posts || [])
        .map((post) => {
          const postAuthor = post.author;
          return {
            id: `N${post.id}`,
            content: parse(post.content, 'extended'),
            userId: postAuthor ? `N${postAuthor.id}` : 'unknown',
            media: [],
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            discussionId,
            user: {
              id: postAuthor ? `N${postAuthor.id}` : 'unknown',
              username: postAuthor ? postAuthor.username : UNKNOWN_USER,
              displayName: postAuthor ? postAuthor.displayName : UNKNOWN_USER,
              avatarHash: postAuthor?.avatarHash ?? '',
            },
          };
        })
        .filter((post) =>
          Array.isArray(post.content) && post.content.length > 0,
        );

    return {
      id: discussionId,
      name: detail.name,
      userId: author ? `N${author.id}` : 'unknown',
      lastMessageId: detail.lastMessageId ? `N${detail.lastMessageId}` : '',
      messageCount: detail.messageCount,
      memberCount: detail.memberCount,
      createdAt: detail.createdAt,
      updatedAt: detail.updatedAt,
      user: {
        id: author ? `N${author.id}` : 'unknown',
        username: author ? author.username : UNKNOWN_USER,
        displayName: author ? author.displayName : UNKNOWN_USER,
        avatarHash: author?.avatarHash ?? '',
      },
      collections,
      tags: collections,
      posts,
    };
  }

  // Handle current Dunya / Discord discussion
  const detail = await fetchDiscussion('discord', discussionId);
  const posts = (detail.posts || []).map((post) => ({
    id: post.id,
    content: parse(post.content, 'extended'),
    userId: post.authorId,
    media: post.media,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    discussionId,
    user: post.author,
  }));

  return {
    id: detail.id,
    name: detail.name,
    userId: detail.authorId,
    lastMessageId: detail.lastMessageId,
    messageCount: detail.messageCount,
    memberCount: detail.memberCount,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
    user: detail.author,
    collections: [],
    tags: [],
    posts,
  };
});
