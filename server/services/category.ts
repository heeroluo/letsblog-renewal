import {
  validateAndThrow,
  validateIdAndThrow,
} from '#shared/utils/validator/validator';
import {
  validate,
  INVALID_ID_MSG,
} from '#shared/utils/validator/models/category';
import { ErrorCode } from '#shared/utils/app-error';
import {
  create as createRecord,
  update as updateRecord,
  findAll as findAllRecords,
  findOne as findOneRecord,
  destroy as destroyRecord,
} from '#server/repositories/category.repo';
import type { CategoryCreationAttrs } from '#server/models/category.model';

/**
 * 创建分类。
 * @param data 分类数据。
 * @returns 已创建的分类。
 */
export async function create(data: CategoryCreationAttrs) {
  validateAndThrow(() => validate(data), ErrorCode.BadRequest);
  return createRecord(data);
}

/**
 * 更新分类。
 * @param data 分类数据。
 * @param id 分类编号。
 */
export async function update(data: CategoryCreationAttrs, id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  validateAndThrow(() => validate(data), ErrorCode.BadRequest);
  await updateRecord(data, id);
}

/**
 * 删除分类。
 * @param id 分类编号。
 * @returns
 */
export async function destroy(id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  await destroyRecord(id);
}

/**
 * 查询所有分类。
 * @returns 所有分类。
 */
export async function findAll() {
  return findAllRecords();
}

/**
 * 查询单个分类。
 * @param id 分类编号。
 * @returns 分类。
 */
export async function findOne(id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  return findOneRecord(id);
}
