import {createHmac} from 'node:crypto';

export interface DunyaAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarHash: string | null;
}

export interface DunyaTag {
  id: number;
  name: string;
  slug: string;
  color: string | null;
  icon: string | null;
}

export interface DunyaPost {
  id: string;
  content: string;
  authorId: string | null;
  author: DunyaAuthor | null;
  media: Record<string, unknown>[];
  createdAt: string;
  updatedAt: string;
}

export interface DunyaDiscussion {
  id: string;
  source: 'discord' | 'flarum';
  name: string;
  authorId: string | null;
  author: DunyaAuthor | null;
  lastMessageId: string | null;
  messageCount: number;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  tags: DunyaTag[];
  posts?: DunyaPost[];
}

export interface DunyaFeed {
  items: DunyaDiscussion[];
  nextCursor: string | null;
}

/**
 * Fetch a resource from the Dunya data API with an HMAC signature.
 * The signature covers the request timestamp, method, and path, and is
 * verified by Dunya before the request reaches a data route.
 * @param path - Request path including the query string,
 * e.g. "/discussions/feed".
 * @returns Parsed JSON response.
 */
export async function dunyaFetch(path: string): Promise<unknown> {
  const config = useRuntimeConfig();

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac('sha256', config.dunyaApiSecret)
      .update(`${timestamp}\nGET\n${path}`)
      .digest('hex');

  return await $fetch(`${config.dunyaApiBaseUrl}${path}`, {
    headers: {
      'X-Timestamp': String(timestamp),
      'X-Signature': signature,
    },
  });
}
