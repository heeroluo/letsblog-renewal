/**
 * 文章分类数据访问层。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';
import { Model, DataTypes, Op } from 'sequelize';
import { sequelize } from '../core';


/**
 * 文章分类模型。
 */
export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  /**
   * 分类 ID。
   */
  declare categoryid: CreationOptional<number>;
  /**
   * 分类名称。
   */
  declare categoryname: string;
  /**
   * 分类的英文名称。
   */
  declare 'categoryname_en': string;
  /**
   * 分类权重。
   */
  declare weight: number;
  /**
   * 分类下的总文章数。
   */
  declare totalarticles: CreationOptional<number>;
  /**
   * 分类路径。
   */
  declare href: string;
}

Category.init({
  categoryid: {
    type: DataTypes.SMALLINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  categoryname: { type: DataTypes.CHAR },
  'categoryname_en': { type: DataTypes.CHAR },
  weight: { type: DataTypes.TINYINT.UNSIGNED },
  totalarticles: { type: DataTypes.INTEGER.UNSIGNED },
  href: {
    type: DataTypes.VIRTUAL,
    get() {
      let href: string = '/article/list/' + this.categoryid;
      if (this['categoryname_en']) { href += '/' + this['categoryname_en']; }
      return href;
    }
  }
}, {
  sequelize,
  tableName: 'category',
  timestamps: false,
  freezeTableName: true
});

/**
 * 文章分类的属性。
 */
export type CategoryAttrs = InferAttributes<Category>;

/**
 * 创建和更新文章分类时用到的属性。
 */
export type CategoryCreationAttrs = InferCreationAttributes<Category>;


// 创建和更新数据时涉及的字段
// const fields: (keyof CategoryAttrs)[] = [
//   'categoryname',
//   'categoryname_en',
//   'weight'
// ];

/**
 * 创建文章分类记录。
 * @param data 要创建的记录。
 * @returns 已创建的文章分类记录。
 */
export async function create(data: CategoryCreationAttrs) {
  const result = await Category.create(data);
  return result ? result.toJSON() : null;
}

/**
 * 更新文章分类记录。
 * @param data 要更新的字段和数据。
 * @param id 用更新的记录的 ID。
 * @returns 更新的记录数。
 */
export async function update(data: CategoryCreationAttrs, id: number) {
  return (await Category.update(data, {
    // fields,
    where: {
      categoryid: { [Op.eq]: id }
    }
  }))[0];
}

/**
 * 删除文章分类记录。
 * @param id 要删除的记录的 id。
 * @returns 删除的记录数。
 */
export async function destroy(id: number) {
  return Category.destroy({
    where: {
      categoryid: { [Op.eq]: id }
    }
  });
}

/**
 * 获取所有文章分类记录。
 * @returns 文章分类记录列表。
 */
export async function getList() {
  return (await Category.findAll({
    order: [['weight', 'DESC']]
  })).map((item) => item.toJSON());
}
