/**
 * 文章模型定义。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  CreationOptional,
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { initOptions } from './core';
import { User, type UserAttrs } from './user.model';
import { Category, type CategoryAttrs } from './category.model';

/**
 * 文章的所有属性。
 */
export type ArticleAttrs = InferAttributes<Article>;

/**
 * 创建和更新的属性。
 */
export type ArticleCreationAttrs = InferCreationAttributes<Article>;

/**
 * 文章模型。
 */
export class Article extends Model<ArticleAttrs, ArticleCreationAttrs> {
  /**
   * 文章 id。
   */
  declare articleId: CreationOptional<number>;
  /**
   * 文章标题。
   */
  declare title: string;
  /**
   * 文章英文标题。
   */
  declare titleEn: string;
  /**
   * 文章关键字。
   */
  declare keywords: string;
  /**
   * 文章所属分类的 id。
   */
  declare categoryId: number;
  /**
   * 文章摘要。
   */
  declare summary: string;
  /**
   * 文章内容。
   */
  declare content: string;
  /**
   * 权重。
   */
  declare weight: number;
  /**
   * 文章作者的用户 id。
   */
  declare userId: number;
  /**
   * 文章状态。
   */
  declare state: number;
  /**
   * 发布时间。
   */
  declare pubTime: Date;
  /**
   * 总浏览次数。
   */
  declare totalViews: CreationOptional<number>;
  /**
   * 评论总数。
   */
  declare totalComments: CreationOptional<number>;
  /**
   * 文章路径。
   */
  declare href: string;
  /**
   * 所属分类。
   */
  declare category: CategoryAttrs;
  /**
   * 所属分类（内部属性）。
   */
  declare innerCategory: NonAttribute<Category>;
  /**
   * 所属用户。
   */
  declare user: Pick<UserAttrs, 'username' | 'nickname'>;
  /**
   * 所属用户（内部属性）。
   */
  declare innerUser: NonAttribute<User>;
}

Article.init({
  articleId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'articleid',
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  titleEn: {
    type: DataTypes.STRING,
    field: 'title_en',
  },
  keywords: {
    type: DataTypes.STRING,
  },
  categoryId: {
    type: DataTypes.SMALLINT.UNSIGNED,
    field: 'categoryid',
  },
  summary: {
    type: DataTypes.TEXT,
  },
  content: {
    type: DataTypes.TEXT,
  },
  weight: {
    type: DataTypes.SMALLINT.UNSIGNED,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'userid',
  },
  state: {
    type: DataTypes.TINYINT,
  },
  pubTime: {
    type: DataTypes.DATE,
    field: 'pubtime',
  },
  totalViews: {
    type: DataTypes.BIGINT.UNSIGNED,
    field: 'totalviews',
  },
  totalComments: {
    type: DataTypes.BIGINT.UNSIGNED,
    field: 'totalcomments',
  },
  href: {
    type: DataTypes.VIRTUAL,
    get() {
      let href: string = '/article/detail/' + this.articleId;
      if (this.titleEn) {
        href += '/' + this.titleEn;
      }
      return href;
    },
  },
  category: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.innerCategory.toJSON();
    },
  },
  user: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.innerUser.toJSON();
    },
  },
}, {
  ...initOptions,
  tableName: 'article',
});

Article.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'innerCategory',
});
Article.belongsTo(User, {
  foreignKey: 'userId',
  as: 'innerUser',
});
