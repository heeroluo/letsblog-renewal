import { findCategoryAndCheckPermission } from '#server/utils/category';

export default defineEventHandler(async (event) => {
  return findCategoryAndCheckPermission(Number(getQuery(event).categoryId));
});
