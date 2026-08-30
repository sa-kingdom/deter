import {COLLECTIONS} from '../constants/collections';

export default defineEventHandler(() => {
  return COLLECTIONS.filter(
      (c) =>
        c.parentId === null || c.parentId === undefined,
  );
});
