import type { OptionsAttrs } from '~/dal/models/options';

/**
 * 校验站点设置数据。
 * @param options 站点设置数据。
 * @returns 错误信息。
 */
export function validate(options: OptionsAttrs) {
  if (!options.siteName) {
    return '网站名称不能为空';
  }
  if (!options.siteURL) {
    return '网站URL不能为空';
  }
  if (![0, 1].includes(options.isOpen)) {
    return '网站开关参数错误';
  }
}
