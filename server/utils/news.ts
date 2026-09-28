export interface NewsCategory {
  slug: string;
  name: string;
}

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  description: string;
  publishedAt: string;
  category: string;
  categoryName: string;
  source: string;
}

interface NewsCache {
  items: NewsItem[];
  fetchedAt: number;
}

/**
 * Central News Agency (CNA) RSS categories served via Feedburner.
 * @see https://www.cna.com.tw/about/rss.aspx
 */
const CNA_RSS_BASE_URL = 'https://feeds.feedburner.com/rsscna/';

export const NEWS_SOURCE_NAME = '中央通訊社';

export const NEWS_CATEGORIES: NewsCategory[] = [
  {slug: 'politics', name: '政治'},
  {slug: 'social', name: '社會'},
  {slug: 'local', name: '地方'},
  {slug: 'lifehealth', name: '生活'},
  {slug: 'finance', name: '財經'},
  {slug: 'technology', name: '科技'},
  {slug: 'culture', name: '文化'},
  {slug: 'sport', name: '體育'},
  {slug: 'stars', name: '娛樂'},
  {slug: 'mainland', name: '兩岸'},
  {slug: 'intworld', name: '國際'},
];

const CACHE_TTL_MS = 15 * 60 * 1000;
const FETCH_TIMEOUT_MS = 10 * 1000;

let newsCache: NewsCache | null = null;
let inflight: Promise<NewsItem[]> | null = null;

/**
 * Decode basic XML entities in RSS text content.
 * @param text - Raw text possibly containing XML entities.
 * @returns Decoded plain text.
 */
function decodeXmlEntities(text: string): string {
  return text
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
        String.fromCodePoint(Number.parseInt(hex, 16)),
      )
      .replace(/&#(\d+);/g, (_, dec) =>
        String.fromCodePoint(Number.parseInt(dec, 10)),
      )
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, '\'')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');
}

/**
 * Extract the inner text of an XML tag from a fragment,
 * unwrapping CDATA sections and decoding entities.
 * @param fragment - XML fragment of a single RSS item.
 * @param tag - Tag name to extract, e.g. "title".
 * @returns Decoded inner text, or an empty string when absent.
 */
function extractTag(fragment: string, tag: string): string {
  const match = fragment.match(
      new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`),
  );
  if (!match) return '';
  const inner = match[1].replace(
      /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/,
      '$1',
  );
  return decodeXmlEntities(inner.trim());
}

/**
 * Parse an RSS 2.0 document into normalized news items.
 * @param xml - Raw RSS XML string.
 * @param category - Category slug the feed belongs to.
 * @param categoryName - Human-readable category name.
 * @returns Parsed and deduplicated news items.
 */
function parseRssItems(
    xml: string,
    category: string,
    categoryName: string,
): NewsItem[] {
  const items: NewsItem[] = [];
  const seen = new Set<string>();
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null) {
    const fragment = match[1];
    const title = extractTag(fragment, 'title');
    const link = extractTag(fragment, 'link');
    if (!title || !link) continue;

    const id = extractTag(fragment, 'guid') || link;
    if (seen.has(id)) continue;
    seen.add(id);

    const publishedRaw = extractTag(fragment, 'pubDate');
    const publishedAt = publishedRaw ?
      (new Date(publishedRaw).toISOString() || '') :
      '';

    items.push({
      id,
      title,
      link,
      description: extractTag(fragment, 'description'),
      publishedAt,
      category,
      categoryName,
      source: NEWS_SOURCE_NAME,
    });
  }
  return items;
}

/**
 * Fetch and merge all Taiwan news RSS feeds, sorted by publish time.
 * Results are cached in memory for CACHE_TTL_MS.
 * @returns Merged news items sorted newest first.
 */
export async function fetchTaiwanNews(): Promise<NewsItem[]> {
  if (newsCache && (Date.now() - newsCache.fetchedAt) < CACHE_TTL_MS) {
    return newsCache.items;
  }
  if (inflight) return inflight;

  inflight = (async () => {
    const results = await Promise.allSettled(
        NEWS_CATEGORIES.map(async ({slug, name}) => {
          const response = await fetch(`${CNA_RSS_BASE_URL}${slug}`, {
            headers: {'User-Agent': 'Deter/1.0 (+https://deter.sak.starinc.xyz)'},
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          });
          if (!response.ok) {
            throw new Error(`Feed ${slug} responded ${response.status}`);
          }
          return parseRssItems(await response.text(), slug, name);
        }),
    );

    // Deduplicate across feeds: CNA syndicates the same article
    // in multiple categories, and duplicate keys break Vue DOM
    // patching on the client.
    const seenIds = new Set<string>();
    const items = results
        .flatMap((result) => (
          result.status === 'fulfilled' ? result.value : []
        ))
        .sort((a, b) =>
          Date.parse(b.publishedAt || '0') -
          Date.parse(a.publishedAt || '0'),
        )
        .filter((item) => {
          if (seenIds.has(item.id)) return false;
          seenIds.add(item.id);
          return true;
        });

    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      console.error(`Failed to fetch ${failed.length} news feeds`);
    }

    newsCache = {items, fetchedAt: Date.now()};
    return items;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}
