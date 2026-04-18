import { isWeight, isEnTitle, isAutoId } from '../base';
import type { ArticleCreationAttrs, ArticleQueryParams } from '~/dal/models/article';

/**
 * 文章编号错误信息。
 */
export const INVALID_ID_MSG = '无效的文章编号';

/**
 * 校验文章数据。
 * @param article 文章数据。
 * @returns 错误信息。
 */
export function validateProps(article: ArticleCreationAttrs) {
  if (!article.title) {
    return '标题不能为空';
  } else if (article.titleEn && !isEnTitle(article.titleEn)) {
    return '英文标题只能包含小写字母、数字和连字符';
  } else if (!isAutoId(article.categoryId)) {
    return '无效的分类编号';
  } else if (!isWeight(article.weight)) {
    return '权重必须为 0-255 间的整数';
  } else if ([0, 1].indexOf(article.state) === -1) {
    return '无效的状态';
  }
}

/**
 * 校验文章查询参数。
 * @param params 查询参数。
 * @returns 错误信息。
 */
export function validateQueryParams(params: ArticleQueryParams) {
  if (params.minWeight != null && !isWeight(params.minWeight)) {
    return '无效的最小权重';
  } else if (params.maxWeight != null && !isWeight(params.maxWeight)) {
    return '无效的最大权重';
  } else if (
    params.minWeight != null
    && params.maxWeight != null
    && Number(params.minWeight) > Number(params.maxWeight)
  ) {
    return '最小权重不能大于最大权重';
  } else if (params.categoryId != null && !isAutoId(params.categoryId)) {
    return '无效的分类编号';
  } else if (params.userId != null && !isAutoId(params.userId)) {
    return '无效的用户编号';
  } else if (
    params.categoryIds
    && params.categoryIds.some((id) => {
      return !isAutoId(id);
    })
  ) {
    return '无效的分类编号';
  }
}
