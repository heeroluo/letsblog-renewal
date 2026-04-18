import { isWeight, isEnTitle } from '../base';
import type { CategoryCreationAttrs } from '~/dal/models/category';

/**
 * 分类编号错误信息。
 */
export const INVALID_ID_MSG = '无效的分类编号';

/**
* 验证分类数据。
* @param category 分类数据。
* @returns 错误信息。
*/
export function validate(category: CategoryCreationAttrs) {
  if (!category.categoryName) {
    return '分类名不能为空';
  }
  if (category.categoryNameEn && !isEnTitle(category.categoryNameEn)) {
    return '英文分类名只能包含小写字母、数字和连字符';
  }
  if (!isWeight(category.weight)) {
    return '权重必须为 0-255 间的整数';
  }
}
