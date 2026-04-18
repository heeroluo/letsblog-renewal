/**
 * 用户模型定义。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { initOptions } from './core';
import { UserGroup } from './user-group.model';

/**
 * 用户的所有属性。
 */
export type UserAttrs = InferAttributes<User>;

/**
 * 创建和更新用户的属性。
 */
export type UserCreationAttrs = InferCreationAttributes<User>;

/**
 * 更新用户个人资料的属性。
 */
export type UserPofileUpdatingAttrs = Pick<UserAttrs, 'groupId' | 'nickname' | 'email'>;

/**
 * 用户模型。
 */
export class User extends Model<UserAttrs, UserCreationAttrs> {
  /**
   * 用户 id。
   */
  declare userId: CreationOptional<number>;
  /**
   * 用户名。
   */
  declare username: string;
  /**
   * 密码。
   */
  declare password: string;
  /**
   * 所属用户组的 id。
   */
  declare groupId: number;
  /**
   * 昵称。
   */
  declare nickname: string;
  /**
   * 电子邮件。
   */
  declare email: string;
  /**
   * 注册时间。
   */
  declare regTime: Date;
  /**
   * 最后活动时间。
   */
  declare lastActivity: Date;
  /**
   * 最后活动 IP。
   */
  declare lastIP: string;
  /**
   * 总文章数。
   */
  declare totalArticles: CreationOptional<number>;
  /**
   * 总评论数。
   */
  declare totalComments: CreationOptional<number>;
  /**
   * 所属用户组（关联）。
   */
  declare userGroup?: UserGroup;
}

User.init({
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'userid',
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    field: 'username',
  },
  password: {
    type: DataTypes.CHAR,
  },
  groupId: {
    type: DataTypes.SMALLINT.UNSIGNED,
    field: 'groupid',
  },
  nickname: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  regTime: {
    type: DataTypes.DATE,
    field: 'regtime',
  },
  lastActivity: {
    type: DataTypes.DATE,
    field: 'lastactivity',
  },
  lastIP: {
    type: DataTypes.STRING,
    field: 'lastip',
  },
  totalArticles: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'totalarticles',
  },
  totalComments: {
    type: DataTypes.BIGINT.UNSIGNED,
    field: 'totalcomments',
  },
}, {
  ...initOptions,
  tableName: 'user',
  getterMethods: {
    name() {
      return this.nickname || this.username;
    },
  },
});

User.belongsTo(UserGroup, {
  foreignKey: 'groupId',
  as: 'userGroup',
});
