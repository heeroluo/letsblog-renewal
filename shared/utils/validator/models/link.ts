import { isWeight } from '../base';
import type { LinkCreationAttrs } from '~/dal/models/link';

/**
 * 链接编号错误信息。
 */
export const INVALID_ID_MSG = '无效的链接编号';

/**
 * 验证链接数据。
 * @param link 链接数据。
 * @returns 错误信息。
 */
export function validate(link: LinkCreationAttrs): string | undefined {
  if (!link.linkName) {
    return '站名不能为空';
  }
  if (!link.siteURL) {
    return '链接不能为空';
  }
  if (!isWeight(link.weight)) {
    return '权重必须为 0-255 间的整数';
  }
}
