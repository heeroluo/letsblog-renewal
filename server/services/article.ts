import {
  validateAndThrow,
  validateIdAndThrow,
} from '#shared/utils/validator/validator';
import { findOne as findOneCategory } from './category';
import {
  validateProps,
  validateQueryParams,
  INVALID_ID_MSG,
} from '#shared/utils/validator/models/article';
import { ErrorCode } from '#shared/utils/app-error';
import { cleanContent, getDisplayedContent, getSummary } from '#shared/utils/article';
import {
  create as createRecord,
  update as updateRecord,
  findOne as findOneRecord,
  findAll as findAllRecord,
  type ArticleCreationAttrs,
  type ArticleQueryParams,
} from '#server/repositories/article.repo';
import type { UserAttrs } from '#server/repositories/user.repo';

export const DEFAULT_WEIGHT = 60;

// 验证文章数据
async function preCreationAndUpdating(article: ArticleCreationAttrs, user: UserAttrs) {
  validateAndThrow(() => validateProps(article), ErrorCode.BadRequest);

  await validateAndThrow(async () => {
    if (!await findOneCategory(article.categoryId)) {
      return '分类不存在';
    }
  }, ErrorCode.BadRequest);

  article.content = cleanContent(article.content);
  article.summary = getSummary(article.content);
  article.userId = user.userId;

  // 拥有文章管理权限的用户才能指定权重，否则使用默认值
  if (!user.userGroup?.permManageArticle) {
    article.weight = DEFAULT_WEIGHT;
  }
}

/**
 * 创建文章。
 * @param article 文章数据。
 * @param user 当前操作用户。
 */
export async function create(article: ArticleCreationAttrs, user: UserAttrs) {
  await preCreationAndUpdating(article, user);
  await createRecord(article);
}

/**
 * 更新文章。
 * @param id 文章编号。
 * @param article 文章数据。
 * @param user 当前操作用户。
 */
export async function update(id: number, article: ArticleCreationAttrs, user: UserAttrs) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  preCreationAndUpdating(article, user);
  await updateRecord(id, article);
}

/**
 * 查询单篇文章。
 * @param id 文章编号。
 * @returns 文章。
 */
export async function findOne(id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);

  const article = await findOneRecord(id);
  if (article) {
    article.content = getDisplayedContent(article.content);
  }
  return article;
}

/**
 * 查询所有符合条件的文章。
 * @param pageSize 每页记录数。
 * @param page 页码。
 * @param params 过滤条件。
 * @returns 查询结果。
 */
export async function findAll(
  pageSize: number,
  page: number,
  params: ArticleQueryParams,
) {
  validateAndThrow(() => validateQueryParams(params), ErrorCode.BadRequest);
  return findAllRecord(pageSize, page, params);
}
