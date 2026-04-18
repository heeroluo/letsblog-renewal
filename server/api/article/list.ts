import { findCategoryAndCheckPermission } from '#server/utils/category';
import { findAll } from '#server/repositories/article.repo';

export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const categoryId = Number(params.categoryId);

  await findCategoryAndCheckPermission(categoryId);

  return findAll(10, Number(params.page) || 1, {
    categoryId: categoryId,
    minWeight: 1,
  });
});
