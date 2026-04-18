/**
 * 文章的数据访问层。
 */

import type { WhereOptions } from 'sequelize';
import type { DataList } from '#shared/types/data';
import { Op, literal } from 'sequelize';
import { User, type UserAttrs } from '../models/user.model';
import { Category } from '../models/category.model';
import {
  type ArticleCreationAttrs,
  type ArticleAttrs,
  Article,
} from '../models/article.model';

/**
 * 创建文章记录。
 * @param data 要创建的数据。
 * @returns 已创建的记录。
 */
export async function create(data: ArticleCreationAttrs) {
  const result = await Article.create(data);
  return result ? result.toJSON() : null;
}

/**
 * 更新文章记录。
 * @param data 要更新的数据。
 * @param id 目标记录的 id。
 * @returns 更新的记录数。
 */
export async function update(id: number, data: ArticleCreationAttrs) {
  return (await Article.update(data, {
    where: {
      articleId: { [Op.eq]: id },
    },
  }))[0];
}

/**
 * 删除文章记录。
 * @param ids 目标记录的 id。
 * @param userid 作者的用户 id。
 * @returns 删除的记录数。
 */
export function destroy(ids: number[], userId: number) {
  const where: WhereOptions<ArticleAttrs> = {
    articleId: { [Op.in]: ids },
  };
  if (userId) {
    where.userId = { [Op.eq]: userId };
  }
  return Article.destroy({ where });
}

/**
 * 增加文章的浏览次数。
 * @param id 目标记录的 id。
 * @returns 更新的记录数。
 */
export async function addViews(id: number) {
  return (await Article.update({
    totalViews: literal('totalviews + 1'),
  }, {
    where: {
      articleId: { [Op.eq]: id },
    },
  }))[0];
}

/**
 * 查询单条文章记录。
 * @param id 目标记录的 id。
 * @returns 文章记录。
 */
export async function findOne(id: number) {
  const result = await Article.findOne({
    where: {
      articleId: { [Op.eq]: id },
    },
    include: [{
      model: Category,
      as: 'innerCategory',
    }, {
      model: User,
      as: 'innerUser',
      attributes: ['username', 'nickname'],
    }],
  });
  return result ? result.toJSON() : result;
}

/**
 * 文章列表的过滤条件
 */
export interface ArticleQueryParams {
  /**
   * 最小权重。
   */
  minWeight?: number
  /**
   * 最大权重。
   */
  maxWeight?: number
  /**
   * 文章分类 id（单个）。
   */
  categoryId?: number
  /**
   * 文章分类 id（多个）。
   */
  categoryIds?: number[]
  /**
   * 用户 id。
   */
  userId?: number
  /**
   * 用户名称（用户名或昵称）
   */
  name?: string
  /**
   * 状态。
   */
  state?: number
  /**
   * 标题。
   */
  title?: string
}

/**
 * 查询所有符合条件的文章记录。
 * @param pageSize 每页记录数。
 * @param page 页码。
 * @param params 过滤条件。
 * @returns 查询结果。
 */
export async function findAll(
  pageSize: number,
  page: number,
  params: ArticleQueryParams,
): Promise<DataList<ArticleAttrs>> {
  const where: WhereOptions<ArticleAttrs> = {
    weight: {
      [Op.and]: {},
    },
  };
  let userWhere: WhereOptions<UserAttrs> | undefined;

  if (params) {
    // 最小权重
    if (params.minWeight != null) {
      (<any>where.weight)[Op.and][Op.gte] = params.minWeight;
    }
    // 最大权重
    if (params.maxWeight != null) {
      (<any>where.weight)[Op.and][Op.lte] = params.maxWeight;
    }
    // 分类编号
    if (params.categoryId != null) {
      where.categoryId = {
        [Op.eq]: params.categoryId,
      };
    } else if (params.categoryIds != null) {
      where.categoryId = {
        [Op.in]: params.categoryIds,
      };
    }
    // 用户编号
    if (params.userId != null) {
      where.userId = {
        [Op.eq]: params.userId,
      };
    }
    // 发布状态
    if (params.state != null) {
      where.state = {
        [Op.eq]: params.state,
      };
    }
    // 用户名或昵称
    if (params.name) {
      userWhere = {
        [Op.or]: {
          username: {
            [Op.like]: `%${params.name}%`,
          },
          nickname: {
            [Op.like]: `%${params.name}%`,
          },
        },
      };
    }
    // 标题
    if (params.title) {
      where.title = {
        [Op.like]: `%${params.title}%`,
      };
    }
  }

  const result = await Article.findAndCountAll({
    where,
    attributes: {
      exclude: ['content'],
    },
    include: [{
      model: Category,
      as: 'innerCategory',
    }, {
      model: User,
      as: 'innerUser',
      attributes: ['username', 'nickname'],
      where: userWhere,
    }],
    order: [
      ['pubTime', 'DESC'],
      ['weight', 'DESC'],
    ],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    rowCount: result.count,
    pageCount: Math.ceil(result.count / pageSize),
    page,
    rows: result.rows.map(item => item.toJSON()),
  };
}

/**
 * 查询相邻的文章。
 * @param articleid 文章编号。
 * @param categoryid 分类编号。
 * @param prevOrNext 前一篇还是后一篇。
 * @returns 查询结果。
 */
export async function findAdjacent(
  articleId: number,
  categoryId: number,
  prevOrNext: boolean,
) {
  const result = await Article.findOne({
    attributes: {
      exclude: ['summary', 'content'],
    },
    where: {
      articleId: { [prevOrNext ? Op.gt : Op.lt]: articleId },
      categoryId: { [Op.eq]: categoryId },
      state: { [Op.eq]: 1 },
    },
    order: [
      ['pubtime', prevOrNext ? 'ASC' : 'DESC'],
    ],
  });
  return result ? result.toJSON() : result;
}
