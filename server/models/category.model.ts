/**
 * 分类模型定义。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { initOptions } from './core';

/**
 * 分类的所有属性。
 */
export type CategoryAttrs = InferAttributes<Category>;

/**
 * 创建和更新分类的属性。
 */
export type CategoryCreationAttrs = InferCreationAttributes<Category>;

/**
 * 分类模型。
 */
export class Category extends Model<CategoryAttrs, CategoryCreationAttrs> {
  /**
   * 分类 id。
   */
  declare categoryId: CreationOptional<number>;
  /**
   * 分类名称。
   */
  declare categoryName: string;
  /**
   * 分类的英文名称。
   */
  declare categoryNameEn: string;
  /**
   * 分类权重。
   */
  declare weight: number;
  /**
   * 分类下的总文章数。
   */
  declare totalArticles: CreationOptional<number>;
  /**
   * 分类路径。
   */
  declare href: string;
}

Category.init({
  categoryId: {
    type: DataTypes.SMALLINT.UNSIGNED,
    field: 'categoryid',
    primaryKey: true,
    autoIncrement: true,
  },
  categoryName: {
    type: DataTypes.CHAR,
    field: 'categoryname',
  },
  categoryNameEn: {
    type: DataTypes.CHAR,
    field: 'categoryname_en',
  },
  weight: {
    type: DataTypes.TINYINT.UNSIGNED,
  },
  totalArticles: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'totalarticles',
  },
  href: {
    type: DataTypes.VIRTUAL,
    get() {
      let href: string = '/article/list/' + this.categoryId;
      if (this.categoryNameEn) {
        href += '/' + this.categoryNameEn;
      }
      return href;
    },
  },
}, {
  ...initOptions,
  tableName: 'category',
});
