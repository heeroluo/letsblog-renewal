import { findCategoryAndCheckPermission } from '#server/utils/category';
import { findAll, findHomepageList } from '#server/services/article';

export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const categoryId = Number(params.categoryId);

  if (categoryId) {
    await findCategoryAndCheckPermission(categoryId);
  }

  const page = Number(params.page) || 1;
  if (page === 1 && !categoryId) {
    return findHomepageList();
  } else {
    return findAll(10, Number(params.page) || 1, {
      categoryId: categoryId ? categoryId : undefined,
      minWeight: 1,
      state: 1,
    });
  }
});
