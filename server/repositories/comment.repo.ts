/**
 * 评论的数据访问层。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  WhereOptions,
} from 'sequelize';
import { Model, DataTypes, Op } from 'sequelize';
import { sequelize } from './core';
import { Article, type ArticleAttrs } from './article.repo';
import { User } from './user.repo';

/**
 * 评论的所有属性。
 */
export type CommentAttrs = InferAttributes<Comment>;

/**
 * 创建评论的属性。
 */
export type CommentCreationAttrs = InferCreationAttributes<Comment>;

/**
 * 评论模型。
 */
export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  /**
   * 文章 ID。
   */
  declare commentId: CreationOptional<number>;
  /**
   * 作者的用户 ID。
   */
  declare userId: number;
  /**
   * 作者的昵称。
   */
  declare userNickname: string;
  /**
   * 作者的邮箱地址。
   */
  declare userEmail: string;
  /**
   * 作者的QQ/微信号。
   */
  declare userQQ: string;
  /**
   * 所属文章的编号。
   */
  declare articleId: number;
  /**
   * 评论内容。
   */
  declare content: string;
  /**
   * 发布时间。
   */
  declare pubTime: Date;
  /**
   * 作者 IP。
   */
  declare ip: string;
  /**
   * 评论状态。
   */
  declare state: number;
  /**
   * 所属文章。
   */
  declare article?: Article;
}

Comment.init({
  commentId: {
    type: DataTypes.BIGINT.UNSIGNED,
    field: 'commentid',
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'userid',
  },
  userNickname: {
    type: DataTypes.STRING,
    field: 'user_nickname',
  },
  userEmail: {
    type: DataTypes.STRING,
    field: 'user_email',
  },
  userQQ: {
    type: DataTypes.STRING,
    field: 'user_qq',
  },
  articleId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'articleid',
  },
  content: { type: DataTypes.TEXT },
  pubTime: {
    type: DataTypes.DATE,
    field: 'pubTime',
  },
  ip: { type: DataTypes.STRING },
  state: { type: DataTypes.TINYINT.UNSIGNED },
}, {
  sequelize,
  tableName: 'comment',
  timestamps: false,
  freezeTableName: true,
});

Comment.belongsTo(Article, {
  foreignKey: 'articleid',
  as: 'article',
});
Comment.belongsTo(User, {
  foreignKey: 'userid',
  as: 'user',
});

/**
 * 创建评论记录。
 * @param data 要创建的记录。
 * @returns 已创建的评论记录。
 */
export async function create(data: CommentCreationAttrs) {
  const result = await Comment.create(data);
  return result ? result.toJSON() : null;
}

/**
 * 批量更新评论状态。
 * @param state 状态。
 * @param ids 评论 id。
 * @returns 更新的记录数。
 */
export async function updateState(state: number, ids: number[]) {
  return (await Comment.update({
    state,
  }, {
    where: {
      commentId: {
        [Op.in]: ids,
      },
    },
  }))[0];
}

export async function deleteByCommentIds(ids: number[]) {
  return Comment.destroy({
    where: {
      commentId: {
        [Op.in]: ids,
      },
    },
  });
}

export async function deleteByArticleIds(ids: number[]) {
  return Comment.destroy({
    where: {
      articleId: {
        [Op.in]: ids,
      },
    },
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
      where.articleId = {
        [Op.eq]: params.articleid,
      };
    }
    // 状态
    if (params.state != null) {
      where.state = {
        [Op.eq]: params.state,
      };
    }
    // 文章标题
    if (params.title != null) {
      articleWhere = {
        title: {
          [Op.like]: `%${params.title}%`,
        },
      };
    }
  }

  const rowCount = await Comment.count({
    where,
  });
  let pageCount = 0;
  let rows: Comment[] = [];

  if (rowCount > 0) {
    pageCount = Math.ceil(rowCount / pageSize);
    if (page === -1) {
      page = pageCount;
    }

    rows = await Comment.findAll({
      where,
      order: [['pubtime', 'ASC']],
      include: [{
        model: Article,
        attributes: ['articleid', 'title', 'title_en'],
        where: articleWhere,
      }, {
        model: User,
        attributes: ['nickname', 'email'],
      }],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  }

  return {
    rowCount: rowCount,
    pageCount,
    page,
    rows: rows.map((item) => {
      return item.toJSON();
    }),
  };
}

export async function getTotalCommentsAfterTime(time: Date, ip: string) {
  return Comment.count({
    where: {
      pubTime: {
        [Op.gte]: time,
      },
      ip: {
        [Op.eq]: ip,
      },
    },
  });
}

export async function getTotalPendingReviews() {
  return Comment.count({
    where: {
      state: {
        [Op.eq]: 0,
      },
    },
  });
}
