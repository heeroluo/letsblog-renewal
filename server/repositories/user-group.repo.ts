/**
 * 用户组的数据访问层。
 */

import { Op } from 'sequelize';
import {
  type UserGroupCreationAttrs,
  UserGroup,
} from '../models/user-group.model';

/**
 * 创建用户组记录。
 * @param data 要创建的数据。
 * @returns 已创建的记录。
 */
export async function create(data: UserGroupCreationAttrs) {
  const result = await UserGroup.create(data);
  return result ? result.toJSON() : null;
}

/**
 * 更新用户组记录。
 * @param data 要更新的数据。
 * @param id 目标记录的 id。
 * @returns 更新的记录数。
 */
export async function update(data: UserGroupCreationAttrs, id: number) {
  return (await UserGroup.update(data, {
    where: {
      groupId: { [Op.eq]: id },
    },
  }))[0];
}

/**
 * 删除用户组记录。
 * @param id 目标记录的 id。
 * @returns 删除的记录数。
 */
export function destroy(id: number) {
  return UserGroup.destroy({
    where: {
      groupId: { [Op.eq]: id },
    },
  });
}

/**
 * 查询所有用户组记录。
 * @returns 所有用户组记录。
 */
export async function findAll() {
  return (
    await UserGroup.findAll()
  ).map(item => item.toJSON());
}

/**
 * 查询单条用户组记录。
 * @param id 目标记录的 id。
 * @returns 用户组记录。
 */
export async function findOne(id: number) {
  const result = await UserGroup.findOne({
    where: {
      groupId: { [Op.eq]: id },
    },
  });
  return result ? result.toJSON() : result;
}
