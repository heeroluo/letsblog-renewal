import { isAutoId } from '#shared/utils/validator/base';
import { AppError } from '#shared/utils/app-error';
import {
  create as createCommentRecord,
  list as listCommentRecords,
  getTotalPendingReviews as getTotalPendingReviewsRecord,
  updateState as updateCommentStateRecord,
  deleteByCommentIds as deleteByCommentIdsRecord,
  deleteByArticleIds as deleteByArticleIdsRecord,
  type CommentCreationAttrs,
  type CommentListFilter,
} from '#server/repositories/comment.repo';

const INVALID_STATE_MSG = '无效的评论状态';

/**
 * 验证评论数据。
 * @param comment 评论数据。
 * @returns 错误信息；若通过则返回 `undefined`。
 */
export function validate(comment: CommentCreationAttrs) {
  if (!comment.content) {
    return '评论内容不能为空';
  }
  if (comment.content.length > 1000) {
    return '评论内容不能多于1000个字符';
  }
  if (!isAutoId(comment.articleId)) {
    return '文章编号不能为空';
  }
  // BLL 目前不做权限推断，直接要求 state 合法。
  if (![0, 1].includes(comment.state)) {
    return INVALID_STATE_MSG;
  }
}

/**
 * 创建评论。
 * @param comment 要创建的评论数据。
 * @returns 已创建的记录（或 `null`）。
 */
export async function create(comment: CommentCreationAttrs) {
  const errMsg = validate(comment);
  if (errMsg) {
    throw new AppError({
      message: errMsg,
      code: 400,
    });
  }

  return createCommentRecord(comment);
}

/**
 * 读取评论列表（带分页）。
 * @param params 查询条件。
 * @param pageSize 每页条数。
 * @param page 页码；`-1` 表示自动到最后一页（由 DAL 决定）。
 */
export async function list(params: CommentListFilter, pageSize: number, page: number) {
  return listCommentRecords(pageSize, page, params);
}

/**
 * 获取未审核评论数量。
 */
export async function getTotalPendingReviews() {
  return getTotalPendingReviewsRecord();
}

/**
 * 更新评论状态。
 * @param state 目标状态（0/1）。
 * @param commentids 要更新的评论编号列表。
 */
export async function updateState(state: number, commentids: number[]) {
  let errMsg: string | undefined;
  if (![0, 1].includes(state)) {
    errMsg = INVALID_STATE_MSG;
  } else if (!commentids.length) {
    errMsg = '请选择要操作的评论';
  } else if (commentids.some(id => !isAutoId(id))) {
    errMsg = '无效的评论编号';
  }

  if (errMsg) {
    throw new AppError({
      message: errMsg,
      code: 400,
    });
  }

  return updateCommentStateRecord(state, commentids);
}

/**
 * 根据评论编号批量删除评论。
 * @param commentids 要删除的评论编号列表。
 */
export async function deleteByCommentIds(commentids: number[]) {
  let errMsg: string | undefined;
  if (!commentids.length) {
    errMsg = '请选择要操作的评论';
  } else if (commentids.some(id => !isAutoId(id))) {
    errMsg = '无效的评论编号';
  }

  if (errMsg) {
    throw new AppError({
      message: errMsg,
      code: 400,
    });
  }

  return deleteByCommentIdsRecord(commentids);
}

/**
 * 根据文章编号批量删除评论。
 * @param articleids 要删除的文章编号列表。
 */
export async function deleteByArticleIds(articleids: number[]) {
  let errMsg: string | undefined;
  if (!articleids.length) {
    errMsg = '请选择要操作的文章';
  } else if (articleids.some(id => !isAutoId(id))) {
    errMsg = '无效的文章编号';
  }

  if (errMsg) {
    throw new AppError({
      message: errMsg,
      code: 400,
    });
  }

  return deleteByArticleIdsRecord(articleids);
}
