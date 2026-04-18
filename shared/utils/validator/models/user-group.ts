import type { UserGroupCreationAttrs } from '~/dal/models/user-group';

/**
 * 用户组编号错误信息。
 */
export const INVALID_ID_MSG = '无效的用户组编号';

/**
 * 验证用户组数据。
 * @param userGroup 用户组数据。
 * @returns 错误信息。
 */
export function validate(userGroup: UserGroupCreationAttrs): string | undefined {
  if (!userGroup.groupName) {
    return '组名不能为空';
  }
  if (![0, 1, 2].includes(userGroup.permComment)) {
    return '无效的评论权限';
  }
  if (![0, 1].includes(userGroup.permArticle)) {
    return '无效的文章发布权限';
  }
  if (![0, 1].includes(userGroup.permManageOption)) {
    return '无效的站点设置权限';
  }
  if (![0, 1, 2].includes(userGroup.permManageUser)) {
    return '无效的用户管理权限';
  }
  if (![0, 1, 2].includes(userGroup.permManageArticle)) {
    return '无效的文章管理权限';
  }
  if (![0, 1, 2].includes(userGroup.permManageComment)) {
    return '无效的评论管理权限';
  }
}
