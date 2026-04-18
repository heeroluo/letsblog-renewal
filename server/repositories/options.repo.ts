/**
 * 站点设置的数据访问层。
 */

import {
  type OptionsAttrs,
  Options,
} from '#server/models/options.model';

/**
 * 查询站点设置记录。
 * @returns 站点设置记录。
 */
export async function findOne() {
  const result = await Options.findOne();
  return result ? result.toJSON() : result;
}

/**
 * 更新站点设置记录。
 * @param data 要更新的数据。
 * @returns 更新的记录数。
 */
export async function update(data: OptionsAttrs) {
  return (await Options.update(data, {
    where: {},
  }))[0];
}
