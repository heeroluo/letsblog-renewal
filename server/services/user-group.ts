import {
  validateAndThrow,
  validateIdAndThrow,
} from '#shared/utils/validator/validator';
import { validate, INVALID_ID_MSG } from '#shared/utils/validator/models/user-group';
import { ErrorCode } from '#shared/utils/app-error';
import {
  create as createUserGroupRecord,
  update as updateUserGroupRecord,
  destroy as destroyUserGroupRecord,
  findAll as findAllUserGroupsRecord,
  findOne as findOneUserGroupRecord,
  type UserGroupCreationAttrs,
} from '#server/repositories/user-group.repo';

/**
 * 创建用户组。
 * @param data 用户组数据。
 * @returns 已创建的用户组。
 */
export async function create(data: UserGroupCreationAttrs) {
  validateAndThrow(() => validate(data), ErrorCode.BadRequest);
  return createUserGroupRecord(data);
}

/**
 * 更新用户组。
 * @param data 用户组数据。
 * @param id 用户组编号。
 */
export async function update(data: UserGroupCreationAttrs, id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  validateAndThrow(() => validate(data), ErrorCode.BadRequest);
  await updateUserGroupRecord(data, id);
}

/**
 * 删除用户组。
 * @param id 用户组编号。
 */
export async function destroy(id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  validateAndThrow(() => {
    if (id <= 2) {
      return '不能删除系统用户组';
    }
  }, ErrorCode.Forbidden);

  const userGroup = await findOneUserGroupRecord(id);
  validateAndThrow(() => {
    if (userGroup?.totalUsers) {
      return '不能删除有用户的用户组';
    }
  }, ErrorCode.Forbidden);

  await destroyUserGroupRecord(id);
}

/**
 * 查询所有用户组。
 * @returns 所有用户组。
 */
export async function findAll() {
  return findAllUserGroupsRecord();
}

/**
 * 查询单个用户组。
 * @param id 用户组编号。
 * @returns 用户组。
 */
export async function findOne(id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  return findOneUserGroupRecord(id);
}
