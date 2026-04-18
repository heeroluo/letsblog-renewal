import { validateAndThrow } from '#shared/utils/validator/validator';
import { validate } from '#shared/utils/validator/models/options';
import { ErrorCode } from '#shared/utils/app-error';
import {
  findOne as findOneOptionsRecord,
  update as updateOptionsRecord,
  type OptionsAttrs,
} from '#server/repositories/options.repo';

/**
 * 查询唯一的站点设置。
 */
export async function findOne() {
  return findOneOptionsRecord();
}

/**
 * 更新站点设置。
 * @param options 站点设置数据。
 */
export async function update(data: OptionsAttrs) {
  validateAndThrow(() => validate(data), ErrorCode.BadRequest);
  return updateOptionsRecord(data);
}
