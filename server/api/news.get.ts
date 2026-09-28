import {
  NEWS_CATEGORIES,
  fetchTaiwanNews,
} from '../utils/news';

const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 100;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const category = query.category ?
    String(query.category) :
    null;

  const limit = query.limit ?
    Math.min(Number(query.limit) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE) :
    DEFAULT_PAGE_SIZE;

  const offset = query.offset ?
    Math.max(Number(query.offset) || 0, 0) :
    0;

  const allItems = await fetchTaiwanNews();
  const filtered = category ?
    allItems.filter((item) => item.category === category) :
    allItems;

  const items = filtered.slice(offset, offset + limit);
  const hasMore = (offset + items.length) < filtered.length;

  return {
    items,
    hasMore,
    categories: NEWS_CATEGORIES,
  };
});
