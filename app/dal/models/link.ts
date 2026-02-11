/**
 * 外部链接的数据访问层。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Attributes
} from 'sequelize';
import { Model, DataTypes, Op } from 'sequelize';
import { sequelize } from '../core';


/**
 * 外部链接模型。
 */
export class Link extends Model<InferAttributes<Link>, InferCreationAttributes<Link>> {
  /**
   * 链接 ID。
   */
  declare linkid: CreationOptional<number>;
  /**
   * 链接名称。
   */
  declare linkname: string;
  /**
   * 链接 URL。
   */
  declare siteurl: string;
  /**
   * 链接 Logo URL。
   */
  declare logourl: string;
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
  linkid: {
    type: DataTypes.SMALLINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  linkname: { type: DataTypes.CHAR },
  siteurl: { type: DataTypes.CHAR },
  logourl: {
    type: DataTypes.CHAR,
    defaultValue: ''
  },
  introduction: { type: DataTypes.CHAR },
  weight: { type: DataTypes.TINYINT.UNSIGNED }
}, {
  sequelize,
  tableName: 'link',
  timestamps: false,
  freezeTableName: true
});

/**
 * 外部链接的属性。
 */
export type LinkAttrs = Attributes<Link>;

/**
 * 创建和更新外部链接时用到的属性。
 */
export type LinkCUAttrs = Omit<LinkAttrs, 'linkid'>;


// 创建和更新数据时涉及的字段
const fields: (keyof LinkAttrs)[] = [
  'linkname',
  'siteurl',
  'logourl',
  'introduction',
  'weight'
];

/**
 * 创建外部链接记录。
 * @param data 要创建的记录。
 * @returns 已创建的外部链接记录。
 */
export async function create(data: LinkCUAttrs) {
  const result = await Link.create(data, { fields });
  return result ? result.toJSON() : null;
};

/**
 * 更新外部链接记录。
 * @param data 要更新的字段和数据。
 * @param id 用更新的记录的 ID。
 * @returns 更新的记录数。
 */
export async function update(data: LinkCUAttrs, id: number) {
  return (await Link.update(data, {
    fields,
    where: {
      linkid: { [Op.eq]: id }
    }
  }))[0];
};

/**
 * 删除外部链接记录。
 * @param id 要删除的记录的 id。
 * @returns 删除的记录数。
 */
export function destroy(id: number) {
  return Link.destroy({
    where: {
      linkid: { [Op.eq]: id }
    }
  });
}

/**
 * 获取所有外部链接记录。
 * @returns 外部链接记录列表。
 */
export async function getList() {
  const result = await Link.findAll({
    order: [['weight', 'DESC']]
  });
  return result.map((item) => item.toJSON());
}
