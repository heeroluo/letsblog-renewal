/**
 * 用户组数据访问层。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  Attributes,
  CreationOptional,
} from 'sequelize';
import { Model, DataTypes, Op } from 'sequelize';
import { sequelize } from '../core';


/**
 * 用户组模型。
 */
export class UserGroup extends Model<InferAttributes<UserGroup>, InferCreationAttributes<UserGroup>> {
  /**
   * 用户组 ID。
   */
  declare groupid: CreationOptional<number>;
  /**
   * 用户组名称。
   */
  declare groupname: string;
  /**
   * 用户组总用户数（通过触发器更新）。
   */
  declare totalusers: CreationOptional<number>;
  /**
   * 文章发布权限。
   */
  declare 'perm_article': number;
  /**
   * 评论发布权限。
   */
  declare 'perm_comment': number;
  /**
   * 站点设置权限。
   */
  declare 'perm_manage_option': number;
  /**
   * 用户管理权限。
   */
  declare 'perm_manage_user': number;
  /**
   * 文章管理权限。
   */
  declare 'perm_manage_article': number;
  /**
   * 评论管理权限。
   */
  declare 'perm_manage_comment': number;
}

UserGroup.init({
  groupid: {
    type: DataTypes.SMALLINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  groupname: { type: DataTypes.CHAR },
  totalusers: { type: DataTypes.INTEGER.UNSIGNED },
  'perm_article': { type: DataTypes.TINYINT },
  'perm_comment': { type: DataTypes.TINYINT },
  'perm_manage_option': { type: DataTypes.TINYINT },
  'perm_manage_user': { type: DataTypes.TINYINT },
  'perm_manage_article': { type: DataTypes.TINYINT },
  'perm_manage_comment': { type: DataTypes.TINYINT }
}, {
  sequelize,
  tableName: 'usergroup',
  timestamps: false,
  freezeTableName: true
});

/**
 * 用户组的属性。
 */
export type UserGroupAttrs = Attributes<UserGroup>;

/**
 * 创建和更新用户组时用到的属性。
 */
export type UserGroupCUAttrs = Omit<UserGroupAttrs, 'groupid' | 'totalusers'>;


// 创建和更新时的有效字段
const fields: (keyof UserGroupAttrs)[] = [
  'groupname',
  'perm_article',
  'perm_comment',
  'perm_manage_option',
  'perm_manage_user',
  'perm_manage_article',
  'perm_manage_comment'
];

/**
 * 创建用户组记录。
 * @param data 要创建的记录。
 * @returns 已创建的用户组记录。
 */
export async function create(data: UserGroupCUAttrs) {
  const result = await UserGroup.create(data, { fields });
  return result ? result.toJSON() : null;
}

/**
 * 更新用户组记录。
 * @param data 要更新的字段和数据。
 * @param id 要更新的记录的 ID。
 * @returns 更新的记录数。
 */
export async function update(data: UserGroupCUAttrs, id: number) {
  return (await UserGroup.update(data, {
    fields,
    where: {
      groupid: { [Op.eq]: id }
    }
  }))[0];
};

/**
 * 删除用户组记录。
 * @param id 要删除的记录的 ID。
 * @returns 删除的记录数。
 */
export function destroy(id: number) {
  return UserGroup.destroy({
    where: {
      groupid: { [Op.eq]: id }
    }
  });
};

/**
 * 获取所有用户组记录。
 * @returns 用户组记录列表。
 */
export async function getList() {
  return (await UserGroup.findAll()).map((item) => {
    return item.toJSON();
  });
}
