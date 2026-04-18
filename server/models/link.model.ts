/**
 * 外部链接模型定义。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { initOptions } from './core';

/**
 * 外部链接的所有属性。
 */
export type LinkAttrs = InferAttributes<Link>;

/**
 * 创建和更新外部链接的属性。
 */
export type LinkCreationAttrs = InferCreationAttributes<Link>;

/**
 * 外部链接模型。
 */
export class Link extends Model<LinkAttrs, LinkCreationAttrs> {
  /**
   * 链接 id。
   */
  declare linkId: CreationOptional<number>;
  /**
   * 链接名称。
   */
  declare linkName: string;
  /**
   * 链接 URL。
   */
  declare siteURL: string;
  /**
   * 链接 Logo URL。
   */
  declare logoURL: string;
  /**
   * 链接介绍。
   */
  declare introduction: string;
  /**
   * 链接权重。
   */
  declare weight: number;
}

Link.init({
  linkId: {
    type: DataTypes.SMALLINT.UNSIGNED,
    field: 'linkid',
    primaryKey: true,
    autoIncrement: true,
  },
  linkName: {
    type: DataTypes.CHAR,
    field: 'linkname',
  },
  siteURL: {
    type: DataTypes.CHAR,
    field: 'siteurl',
  },
  logoURL: {
    type: DataTypes.CHAR,
    field: 'logourl',
    defaultValue: '',
  },
  introduction: { type: DataTypes.CHAR },
  weight: { type: DataTypes.TINYINT.UNSIGNED },
}, {
  ...initOptions,
  tableName: 'link',
});
