import {
  validateAndThrow,
  validateIdAndThrow,
} from '#shared/utils/validator/validator';
import { validate, INVALID_ID_MSG } from '#shared/utils/validator/models/link';
import { ErrorCode } from '#shared/utils/app-error';
import {
  create as createLinkRecord,
  update as updateLinkRecord,
  destroy as destroyLinkRecord,
  findAll as findAllLinksRecord,
  findOne as findOneLinkRecord,
} from '#server/repositories/link.repo';
import type { LinkCreationAttrs } from '#server/models/link.model';

/**
 * 创建链接。
 * @param data 链接数据。
 * @returns 已创建的链接。
 */
export async function create(data: LinkCreationAttrs) {
  validateAndThrow(() => validate(data), ErrorCode.BadRequest);
  return createLinkRecord(data);
}

/**
 * 更新链接。
 * @param link 链接数据。
 * @param linkId 链接编号。
 */
export async function update(data: LinkCreationAttrs, id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  validateAndThrow(() => validate(data), ErrorCode.BadRequest);
  await updateLinkRecord(data, id);
}

/**
 * 删除链接。
 * @param id 链接编号。
 */
export async function destroy(id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  await destroyLinkRecord(id);
}

/**
 * 查询所有链接。
 * @param minWeight 最小权重。
 * @returns 大于最小权重的所有链接。
 */
export async function findAll(minWeight = 0) {
  return findAllLinksRecord(minWeight);
}

/**
 * 查询单个链接。
 * @param id 链接编号。
 * @returns 链接。
 */
export async function findOne(id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  return findOneLinkRecord(id);
}
