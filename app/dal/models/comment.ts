import type {
  InferAttributes,
  InferCreationAttributes,
  Attributes,
  CreationOptional,
  WhereOptions,
} from 'sequelize';
import { Model, DataTypes, Op } from 'sequelize';
import { sequelize } from '../core';
import { Article, type ArticleAttrs } from './article';
import { User } from './user';


/**
 * 评论模型。
 */
export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  /**
   * 文章 ID。
   */
  declare commentid: CreationOptional<number>;
  /**
   * 作者的用户 ID。
   */
  declare userid: number;
  /**
   * 作者的昵称。
   */
  declare 'user_nickname': string;
  /**
   * 作者的邮箱地址。
   */
  declare 'user_email': string;
  /**
   * 作者的QQ/微信号。
   */
  declare 'user_qq': string;
  /**
   * 所属文章的编号。
   */
  declare articleid: number;
  /**
   * 评论内容。
   */
  declare content: string;
  /**
   * 发布时间。
   */
  declare pubtime: Date;
  /**
   * 作者 IP。
   */
  declare ip: string;
  /**
   * 评论状态。
   */
  declare state: number;
}

Comment.init({
  commentid: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  userid: { type: DataTypes.INTEGER.UNSIGNED },
  'user_nickname': { type: DataTypes.STRING },
  'user_email': { type: DataTypes.STRING },
  'user_qq': { type: DataTypes.STRING },
  articleid: { type: DataTypes.INTEGER.UNSIGNED },
  content: { type: DataTypes.TEXT },
  pubtime: { type: DataTypes.DATE },
  ip: { type: DataTypes.STRING },
  state: { type: DataTypes.TINYINT.UNSIGNED }
}, {
  sequelize,
  tableName: 'comment',
  timestamps: false,
  freezeTableName: true
});

Comment.belongsTo(Article, { foreignKey: 'articleid' });
Comment.belongsTo(User, { foreignKey: 'userid' });

/**
 * 文章的属性。
 */
export type CommentAttrs = Attributes<Comment>;

/**
 * 创建和更新文章时用到的属性。
 */
export type CommentCUAttrs = Omit<CommentAttrs, 'commentid'>;

// 创建和更新数据时涉及的字段
const fields: (keyof CommentCUAttrs)[] = [
  'userid',
  'user_nickname',
  'user_email',
  'user_qq',
  'articleid',
  'content',
  'pubtime',
  'ip',
  'state'
];


/**
 * 创建评论记录。
 * @param data 要创建的记录。
 * @returns 已创建的评论记录。
 */
export async function create(data: CommentCUAttrs) {
  const result = await Comment.create(data, { fields });
  return result ? result.toJSON() : null;
}

export async function updateState(state: number, ids: number[]) {
  return (await Comment.update({
    state
  }, {
    where: {
      commentid: {
        [Op.in]: ids
      }
    }
  }))[0];
}

export async function deleteByCommentIds(ids: number[]) {
  return Comment.destroy({
    where: {
      commentid: {
        [Op.in]: ids
      }
    }
  });
}

export async function deleteByArticleIds(ids: number[]) {
  return Comment.destroy({
    where: {
      articleid: {
        [Op.in]: ids
      }
    }
  });
}

export interface CommentListFilter {
  articleid?: number
  state?: number
  title?: string
}

export async function list(pageSize: number, page: number, params: CommentListFilter) {
  const where: WhereOptions<CommentAttrs> = {};
  let articleWhere: WhereOptions<ArticleAttrs> | undefined;

  if (params) {
    // 文章id
    if (params.articleid != null) {
      where.articleid = {
        [Op.eq]: params.articleid
      };
    }
    // 状态
    if (params.state != null) {
      where.state = {
        [Op.eq]: params.state
      };
    }
    // 文章标题
    if (params.title != null) {
      articleWhere = {
        title: {
          [Op.like]: `%${params.title}%`
        }
      };
    }
  }

  const rowCount = await Comment.count({
    where
  });
  let pageCount = 0;
  let rows: Comment[] = [];

  if (rowCount > 0) {
    pageCount = Math.ceil(rowCount / pageSize);
    if (page === -1) { page = pageCount; }

    rows = await Comment.findAll({
      where,
      order: [['pubtime', 'ASC']],
      include: [{
        model: Article,
        attributes: ['articleid', 'title', 'title_en'],
        where: articleWhere
      }, {
        model: User,
        attributes: ['nickname', 'email']
      }],
      limit: pageSize,
      offset: (page - 1) * pageSize
    });
  }

  return {
    rowCount: rowCount,
    pageCount,
    page,
    rows: rows.map((item) => { return item.toJSON(); })
  };
}

export async function getTotalCommentsAfterTime(time: Date, ip: string) {
  return Comment.count({
    where: {
      pubtime: {
        [Op.gte]: time
      },
      ip: {
        [Op.eq]: ip
      }
    }
  });
};


export async function getTotalPendingReviews() {
  return Comment.count({
    where: {
      state: {
        [Op.eq]: 0
      }
    }
  });
}
