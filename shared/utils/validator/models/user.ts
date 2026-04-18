import {
  isAutoId,
  isEmail,
  isNickname,
  isUsername,
} from '../base';
import { INVALID_ID_MSG as INVALID_GROUP_ID_MSG } from './user-group';
import type {
  UserCreationAttrs,
  UserPofileUpdatingAttrs,
} from '~/dal/models/user';

export const INVALID_ID_MSG = '无效的用户编号';
export const INVALID_USERNAME_MSG = '用户名必须为 2-20 个英文字母、数字或下划线';
export const DUP_NAME_MSG = '用户名或昵称重复';

const INVALID_EMAIL_MSG = 'Email 格式错误';
const INVALID_NICKNAME_MSG = '昵称必须为 2-20 个字符';

/**
 * 校验密码。
 * @param password 密码。
 * @returns 错误信息。
 */
export function validatePassword(password: string) {
  if (password.length < 6 || password.length > 16) {
    return '密码必须为6-16个字符';
  }
  if (/^\d+$/.test(password)) {
    return '密码不能为纯数字';
  }
  if (/^[a-z]+$/i.test(password)) {
    return '密码不能为纯英文';
  }
}

/**
 * 检验个人资料。
 * @param user 用户数据。
 * @returns 错误信息。
 */
export function validateProfile(user: UserPofileUpdatingAttrs) {
  if (!isAutoId(user.groupId)) {
    return INVALID_GROUP_ID_MSG;
  }
  if (user.email && !isEmail(user.email)) {
    return INVALID_EMAIL_MSG;
  }
  if (user.nickname && !isNickname(user.nickname)) {
    return INVALID_NICKNAME_MSG;
  }
}

/**
 * 校验新用户的数据。
 * @param user 新用户数据。
 * @returns 错误信息。
 */
export function validateCreation(user: UserCreationAttrs) {
  if (!isUsername(user.username)) {
    return INVALID_USERNAME_MSG;
  }
  return validatePassword(user.password) || validateProfile(user);
}
