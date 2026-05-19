import { findOne } from '#server/services/category';
import { ErrorCode } from '#shared/utils/app-error';
import type { CategoryAttrs } from '../models/category.model';

export async function findCategoryAndCheckPermission(target: number | CategoryAttrs) {
  let category: CategoryAttrs | null = null;
  if (typeof target === 'object') {
    category = target;
  } else {
    const id = target;
    if (!id) {
      throw createError({
        statusCode: ErrorCode.BadRequest,
      });
    }
    category = await findOne(id);
  }

  if (!category) {
    throw createError({
      statusCode: ErrorCode.NotFound,
    });
  }
  if (category.weight < 1) {
    throw createError({
      statusCode: ErrorCode.Forbidden,
    });
  }
  return category;
}
