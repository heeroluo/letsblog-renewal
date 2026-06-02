import { createHash } from 'crypto';
import { isUsername, isAutoId } from '#shared/utils/validator/base';
import {
  validateAndThrow,
  validateIdAndThrow,
} from '#shared/utils/validator/validator';
import {
  validatePassword,
  validateProfile,
  validateCreation,
  INVALID_ID_MSG,
  INVALID_USERNAME_MSG,
  DUP_NAME_MSG,
} from '#shared/utils/validator/models/user';
import { ErrorCode } from '#shared/utils/app-error';
import {
  create as createRecord,
  updateProfile as updateProfileRecord,
  updateActivity as updateActivityRecord,
  updatePassword as updatePasswordRecord,
  destroy as destroyRecords,
  findAll as findAllRecords,
  findOneByUserId as findOneRecordByUserId,
  findOneByUsername as findOneRecordByUsername,
  findOneByNames as findOneRecordByNames,
} from '#server/repositories/user.repo';
import type {
  UserCreationAttrs,
  UserProfileUpdatingAttrs,
} from '#server/models/user.model';

// 通过 SHA1 算法加密
function encryptPassword(password: string) {
  return createHash('sha1').update(password).digest('hex');
}

/**
 * 创建用户。
 * @param user 用户数据。
 * @returns 已创建的用户。
 */
export async function create(data: UserCreationAttrs) {
  validateAndThrow(() => validateCreation(data), ErrorCode.BadRequest);
  await validateAndThrow(async () => {
    if (await findOneRecordByNames([data.username, data.nickname])) {
      return DUP_NAME_MSG;
    }
  }, ErrorCode.Conflict);

  data.password = encryptPassword(data.password);
  // 默认以用户名为昵称
  data.nickname = data.nickname || data.username;

  return createRecord(data);
}

/**
 * 更新用户资料（不含密码）。
 * @param user 用户资料。
 * @param userId 用户编号。
 */
export async function updateProfile(
  user: UserProfileUpdatingAttrs,
  userId: number,
) {
  validateIdAndThrow(userId, INVALID_ID_MSG);
  validateAndThrow(() => validateProfile(user), ErrorCode.BadRequest);
  await validateAndThrow(async () => {
    const existingUser = await findOneRecordByNames([
      user.nickname,
    ]);
    if (existingUser && existingUser.userId !== userId) {
      return DUP_NAME_MSG;
    }
  }, ErrorCode.Conflict);

  await updateProfileRecord(user, userId);
}

/**
 * 更新用户密码。
 * @param username 用户名。
 * @param newPassword 新密码。
 * @param oldPassword 旧密码；管理员修改时可传 false。
 * @returns 加密的新密码。
 */
export async function updatePassword(
  username: string,
  newPassword: string,
  oldPassword: string | false,
) {
  validateAndThrow(() => {
    if (!isUsername(username)) {
      return INVALID_USERNAME_MSG;
    } else if (!newPassword) {
      return '新密码不能为空';
    } else {
      return validatePassword(newPassword);
    }
  }, ErrorCode.BadRequest);

  let encryptedOldPassword: string | false = false;
  if (oldPassword !== false) {
    validateAndThrow(() => {
      if (oldPassword) {
        return validatePassword(oldPassword);
      } else {
        return '旧密码不能为空';
      }
    }, ErrorCode.Unauthorized);
    encryptedOldPassword = encryptPassword(oldPassword);
  }

  await validateAndThrow(async () => {
    if (!await findOneRecordByUsername(username, encryptedOldPassword)) {
      return '用户不存在或旧密码错误';
    }
  }, ErrorCode.Unauthorized);

  const encryptedNewPassword = encryptPassword(newPassword);
  await updatePasswordRecord(encryptedNewPassword, username);
  return encryptedNewPassword;
}

/**
 * 根据用户编号批量删除用户。
 * @param userIds 用户编号列表。
 */
export async function destroyUsers(userIds: number[]) {
  validateAndThrow(() => {
    if (!userIds.length) {
      return '请指定要操作的用户';
    } else if (userIds.some(id => !isAutoId(id))) {
      return INVALID_ID_MSG;
    }
  }, ErrorCode.BadRequest);

  await destroyRecords(userIds);
}

/**
 * 更新用户最后活动时间与 IP。
 * @param ip IP。
 * @param userId 用户编号。
 */
export async function updateActivity(ip: string, userId: number) {
  validateIdAndThrow(userId, INVALID_ID_MSG);
  validateAndThrow(() => {
    if (!ip) {
      return '非法的登录 IP';
    }
  }, ErrorCode.BadRequest);

  await updateActivityRecord(new Date(), ip, userId);
}

/**
 * 根据用户编号查询用户。
 * @param userId 用户编号。
 * @returns 用户。
 */
export async function findOneByUserId(userId: number) {
  validateIdAndThrow(userId, INVALID_ID_MSG);
  return findOneRecordByUserId(userId);
}

/**
 * 根据用户名和密码读取用户信息（用于登录）。
 * @param username 用户名。
 * @param password 密码。
 */
export async function findOneByUsernameAndPassword(username: string, password: string) {
  validateAndThrow(() => {
    if (!isUsername(username)) {
      return INVALID_USERNAME_MSG;
    }
  }, ErrorCode.BadRequest);

  const encryptedPassword = password.length === 40 ? password : encryptPassword(password);
  validateAndThrow(() => {
    if (!encryptedPassword) {
      return '无效的密码';
    }
  }, ErrorCode.Unauthorized);

  return findOneRecordByUsername(username, encryptedPassword);
}

/**
 * 查询所有符合条件的用户。
 * @param pageSize 每页条数。
 * @param page 页码。
 * @param params 查询条件。
 * @returns 查询结果。
 */
export async function findAll(pageSize: number, page: number, params?: { groupId?: number, name?: string }) {
  return findAllRecords(pageSize, page, params);
}

/**
 * 登录。
 * @param username 用户名。
 * @param password 明文密码。
 * @param ip 登录 IP。
 * @returns 登录的用户。
 */
export async function login(username: string, password: string, ip: string) {
  validateAndThrow(() => {
    if (!isUsername(username)) {
      return INVALID_USERNAME_MSG;
    } else if (!password) {
      return '密码不能为空';
    } else if (validatePassword(password)) {
      return '密码错误';
    } else if (!ip) {
      return '非法的登录IP';
    }
  }, ErrorCode.BadRequest);

  const encryptedPassword = encryptPassword(password);
  const user = await findOneRecordByUsername(username, encryptedPassword);
  validateAndThrow(() => {
    if (!user) {
      return '用户不存在或密码错误';
    }
  }, ErrorCode.Unauthorized);

  if (user) {
    await updateActivityRecord(new Date(), ip, user.userId);
  }
  return user;
}
