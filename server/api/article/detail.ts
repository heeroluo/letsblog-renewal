import { ErrorCode } from '#shared/utils/app-error';
import { findCategoryAndCheckPermission } from '#server/utils/category';
import { findOne } from '#server/repositories/article.repo';

export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const articleId = Number(params.articleId);

  const article = await findOne(articleId);
  if (!article) {
    throw createError({
      statusCode: ErrorCode.NotFound,
    });
  }
  if (article.weight < 1) {
    throw createError({
      statusCode: ErrorCode.Forbidden,
    });
  }

  await findCategoryAndCheckPermission(article.category);

  return article;
});
