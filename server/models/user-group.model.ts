/**
 * 用户组模型定义。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { initOptions } from './core';

/**
 * 用户组的所有属性。
 */
export type UserGroupAttrs = InferAttributes<UserGroup>;

/**
 * 创建和更新用户组的属性。
 */
export type UserGroupCreationAttrs = InferCreationAttributes<UserGroup>;

/**
 * 用户组模型。
 */
export class UserGroup extends Model<UserGroupAttrs, UserGroupCreationAttrs> {
  /**
   * 用户组 id。
   */
  declare groupId: CreationOptional<number>;
  /**
   * 用户组名称。
   */
  declare groupName: string;
  /**
   * 用户组总用户数（通过触发器更新）。
   */
  declare totalUsers: CreationOptional<number>;
  /**
   * 文章发布权限。
   */
  declare permArticle: number;
  /**
   * 评论发布权限。
   */
  declare permComment: number;
  /**
   * 站点设置权限。
   */
  declare permManageOption: number;
  /**
   * 用户管理权限。
   */
  declare permManageUser: number;
  /**
   * 文章管理权限。
   */
  declare permManageArticle: number;
  /**
   * 评论管理权限。
   */
  declare permManageComment: number;
}

UserGroup.init({
  groupId: {
    type: DataTypes.SMALLINT.UNSIGNED,
    field: 'groupid',
    primaryKey: true,
    autoIncrement: true,
  },
  groupName: {
    type: DataTypes.CHAR,
    field: 'groupname',
  },
  totalUsers: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'totalusers',
  },
  permArticle: {
    type: DataTypes.TINYINT,
    field: 'perm_article',
  },
  permComment: {
    type: DataTypes.TINYINT,
    field: 'perm_comment',
  },
  permManageOption: {
    type: DataTypes.TINYINT,
    field: 'perm_manage_option',
  },
  permManageUser: {
    type: DataTypes.TINYINT,
    field: 'perm_manage_user',
  },
  permManageArticle: {
    type: DataTypes.TINYINT,
    field: 'perm_manage_article',
  },
  permManageComment: {
    type: DataTypes.TINYINT,
    field: 'perm_manage_comment',
  },
}, {
  ...initOptions,
  tableName: 'usergroup',
});
