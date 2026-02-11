/**
 * 文章数据访问层。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  WhereOptions
} from 'sequelize';
import { Model, DataTypes, Op, literal } from 'sequelize';
import { sequelize } from '../core';
import { User } from './user';
import { Category } from './category';


/**
 * 文章模型。
 */
export class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
  /**
   * 文章 ID。
   */
  declare articleid: CreationOptional<number>;
  /**
   * 文章标题。
   */
  declare title: string;
  /**
   * 文章英文标题。
   */
  declare 'title_en': string;
  /**
   * 文章关键字。
   */
  declare keywords: string;
  /**
   * 文章所属分类的 ID。
   */
  declare categoryid: number;
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
   * 文章作者的用户 ID。
   */
  declare userid: number;
  /**
   * 文章状态。
   */
  declare state: number;
  /**
   * 发布时间。
   */
  declare pubtime: Date;
  /**
   * 总浏览次数。
   */
  declare totalviews: CreationOptional<number>;
  /**
   * 评论总数。
   */
  declare totalcomments: CreationOptional<number>;
  /**
   * 文章路径。
   */
  declare href: string;
}

Article.init({
  articleid: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  title: { type: DataTypes.STRING },
  'title_en': { type: DataTypes.STRING },
  keywords: { type: DataTypes.STRING },
  categoryid: { type: DataTypes.SMALLINT.UNSIGNED },
  summary: { type: DataTypes.TEXT },
  content: { type: DataTypes.TEXT },
  weight: { type: DataTypes.SMALLINT.UNSIGNED },
  userid: { type: DataTypes.INTEGER.UNSIGNED },
  state: { type: DataTypes.TINYINT },
  pubtime: { type: DataTypes.DATE },
  totalviews: { type: DataTypes.BIGINT.UNSIGNED },
  totalcomments: { type: DataTypes.BIGINT.UNSIGNED },
  href: {
    type: DataTypes.VIRTUAL,
    get() {
      let href: string = '/article/detail/' + this.articleid;
      if (this.title_en) { href += '/' + this.title_en; }
      return href;
    }
  }
}, {
  sequelize,
  tableName: 'article',
  timestamps: false,
  freezeTableName: true
});

Article.belongsTo(Category, { foreignKey: 'categoryid' });
Article.belongsTo(User, { foreignKey: 'userid' });

/**
 * 文章的属性。
 */
export type ArticleAttrs = InferAttributes<Article>;

/**
 * 创建和更新文章时用到的属性。
 */
export type ArticleCreationAttrs = InferCreationAttributes<Article>;


// // 创建和更新数据时涉及的字段
// const fields: (keyof ArticleCUAttrs)[] = [
//   'title',
//   'title_en',
//   'keywords',
//   'categoryid',
//   'summary',
//   'content',
//   'weight',
//   'userid',
//   'state',
//   'pubtime'
// ];

/**
 * 创建文章记录。
 * @param data 要创建的记录。
 * @returns 已创建的文章记录。
 */
export async function create(data: ArticleCreationAttrs) {
  const result = await Article.create(data);
  return result ? result.toJSON() : null;
}

/**
 * 更新文章记录。
 * @param data 要更新的字段和数据。
 * @param id 用更新的记录的 ID。
 * @returns 更新的记录数。
 */
export async function update(data: ArticleCreationAttrs, id: number) {
  return (await Article.update(data, {
    where: {
      articleid: { [Op.eq]: id }
    }
  }))[0];
}

/**
 * 删除文章记录。
 * @param ids 要删除的记录的 id。
 * @param userid 文章作者的用户 ID。
 * @returns 删除的记录数。
 */
export async function destroy(ids: number[], userid: number) {
  const where: WhereOptions<ArticleAttrs> = {
    articleid: { [Op.in]: ids }
  };
  if (userid) { where.userid = { [Op.eq]: userid }; }
  return Article.destroy({ where });
}

/**
 * 增加文章的浏览次数。
 * @param id 要增加浏览次数的文章记录的 ID。
 * @returns 更新的记录数。
 */
export async function addViews(id: number) {
  return (await Article.update({
    totalviews: literal('totalviews + 1')
  }, {
    where: {
      articleid: { [Op.eq]: id }
    }
  }))[0];
}

/**
 * 读取文章记录。
 * @param id 文章编号。
 * @returns 文章记录。
 */
export async function read(id: number) {
  const result = await Article.findOne({
    where: {
      articleid: { [Op.eq]: id }
    }
  });
  return result ? result.toJSON() : result;
}

// 文章列表的过滤条件
interface ArticleListFilter {
  minWeight?: number
  maxWeight?: number
  categoryid?: number
  categoryids?: number[]
  userid?: number
  state?: number
  name?: string
  title?: string
}

/**
 * 获取文章列表。
 * @param pageSize 每页记录数。
 * @param page 页码。
 * @param params 过滤参数。
 * @returns 查询结果。
 */
export async function getList(
  pageSize: number, page: number, params: ArticleListFilter
) {
  const where: WhereOptions<ArticleAttrs> = {
    weight: {
      [Op.and]: {}
    }
  };
  let userWhere;

  if (params) {
    // 最小权重
    if (where.weight) {
      if (params.minWeight != null) {
        (<any>where.weight)[Op.and][Op.gte] = params.minWeight;
      }
      // 最大权重
      if (params.maxWeight != null) {
        (<any>where.weight)[Op.and][Op.lte] = params.maxWeight;
      }
    }
    // 分类编号
    if (params.categoryid != null) {
      where.categoryid = {
        [Op.eq]: params.categoryid
      };
    } else if (params.categoryids != null) {
      where.categoryid = {
        [Op.in]: params.categoryids
      };
    }
    // 用户编号
    if (params.userid != null) {
      where.userid = {
        [Op.eq]: params.userid
      };
    }
    // 发布状态
    if (params.state != null) {
      where.state = {
        [Op.eq]: params.state
      };
    }
    // 用户名或昵称
    if (params.name) {
      userWhere = {
        [Op.or]: {
          username: {
            [Op.like]: `%${params.name}%`
          },
          nickname: {
            [Op.like]: `%${params.name}%`
          }
        }
      };
    }
    // 标题
    if (params.title) {
      where.title = {
        [Op.like]: `%${params.title}%`
      };
    }
  }

  const result = await Article.findAndCountAll({
    where,
    attributes: {
      exclude: ['content']
    },
    include: [{
      model: Category,
      attributes: ['categoryid', 'categoryname', 'categoryname_en']
    }, {
      model: User,
      attributes: ['username', 'nickname'],
      where: userWhere
    }],
    order: [
      ['pubtime', 'DESC'],
      ['weight', 'DESC']
    ],
    limit: pageSize,
    offset: (page - 1) * pageSize
  });

  return {
    rowCount: result.count,
    pageCount: Math.ceil(result.count / pageSize),
    page,
    rows: result.rows.map((item) => {
      return item.toJSON();
    })
  };
}

/**
 * 获取相邻的文章。
 * @param articleid 文章编号。
 * @param categoryid 分类编号。
 * @param prevOrNext 获取前一篇文章还是后一篇文章。
 * @returns 查询结果。
 */
export async function getAdjacent(
  articleid: number, categoryid: number, prevOrNext: boolean
) {
  const result = await Article.findOne({
    attributes: {
      exclude: ['summary', 'content']
    },
    where: {
      articleid: { [prevOrNext ? Op.gt : Op.lt]: articleid },
      categoryid: { [Op.eq]: categoryid },
      state: { [Op.eq]: 1 }
    },
    order: [
      ['pubtime', prevOrNext ? 'ASC' : 'DESC']
    ]
  });
  return result ? result.toJSON() : result;
}
