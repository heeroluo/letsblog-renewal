/**
 * 用户的数据访问层。
 */

import {
  type WhereOptions,
  Op,
} from 'sequelize';
import {
  type UserAttrs,
  type UserCreationAttrs,
  type UserPofileUpdatingAttrs,
  User,
} from '../models/user.model';
import { UserGroup } from '../models/user-group.model';

/**
 * 创建用户记录。
 * @param data 要创建的数据。
 * @returns 已创建的记录。
 */
export async function create(data: UserCreationAttrs) {
  const result = await User.create(data);
  return result ? result.toJSON() : null;
}

/**
 * 更新用户记录中的个人资料字段。
 * @param data 要更新的数据。
 * @param id 目标记录的 id。
 * @returns 更新的记录数。
 */
export async function updateProfile(
  data: UserPofileUpdatingAttrs,
  id: number,
) {
  return (await User.update(data, {
    where: {
      userId: { [Op.eq]: id },
    },
  }))[0];
}

/**
 * 更新用户记录中的最后活动信息字段。
 * @param lastActivity 最后活动时间。
 * @param lastIP 最后活动 IP。
 * @param id 目标记录的 id。
 * @returns 更新的记录数。
 */
export async function updateActivity(
  lastActivity: Date,
  lastIP: string,
  id: number,
) {
  return (await User.update({
    lastActivity,
    lastIP,
  }, {
    where: {
      userId: { [Op.eq]: id },
    },
  }))[0];
}

/**
 * 更新用户记录中的密码字段。
 * @param password 新密码。
 * @param username 用户名。
 * @returns 更新的记录数。
 */
export async function updatePassword(password: string, username: string) {
  return (await User.update({
    password,
  }, {
    where: {
      username: { [Op.eq]: username },
    },
  }))[0];
}

/**
 * 删除用户记录。
 * @param ids 目标记录的 id。
 * @returns 删除的记录数。
 */
export async function destroy(ids: number[]) {
  return User.destroy({
    where: {
      userId: {
        [Op.in]: ids,
      },
    },
  });
}

/**
 * 查询所有符合条件的用户记录。
 * @param pageSize 每页记录数。
 * @param page 页码。
 * @param params 查询条件。
 * @returns 查询结果。
 */
export async function findAll(
  pageSize: number,
  page: number,
  params?: { groupId?: number, name?: string },
) {
  const where: WhereOptions<UserAttrs> = {};
  if (params) {
    if (params.groupId) {
      where.groupId = {
        [Op.eq]: params.groupId,
      };
    }
    if (params.name) {
      (<any>where)[Op.or] = {
        username: {
          [Op.like]: `%${params.name}%`,
        },
        nickname: {
          [Op.like]: `%${params.name}%`,
        },
      };
    }
  }

  const result = await User.findAndCountAll({
    where,
    attributes: {
      exclude: ['password'],
    },
    include: [{
      model: UserGroup,
      attributes: ['groupName'],
    }],
    order: [['userid', 'DESC']],
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
 * 根据用户 id 查询单条用户记录。
 * @param id 用户 id。
 * @returns 用户记录。
 */
export async function findOneByUserId(id: number) {
  const result = await User.findOne({
    where: {
      userId: { [Op.eq]: id },
    },
    include: [{
      model: UserGroup,
      as: 'userGroup',
    }],
  });
  return result ? result.toJSON() : result;
}

/**
 * 根据用户名、密码查询单条用户记录。
 * @param username 用户名。
 * @param password 密码。如果为 false，则只根据用户名查询。
 * @returns 用户记录。
 */
export async function findOneByUsername(username: string, password: string | false) {
  const where: WhereOptions<User> = {
    username: { [Op.eq]: username },
  };
  if (password != false) {
    where.password = { [Op.eq]: password };
  }
  const result = await User.findOne({ where });
  return result ? result.toJSON() : result;
}

/**
 * 根据名称（用户名或昵称）查询用户记录。
 * @param names 名称（用户名或昵称）。
 * @returns 用户记录。
 */
export async function findOneByNames(names: string[]) {
  names = names.filter(name => !!name);
  if (!names.length) {
    return null;
  }
  const result = await User.findOne({
    where: {
      [Op.or]: {
        username: {
          [Op.in]: names,
        },
        nickname: {
          [Op.in]: names,
        },
      },
    },
  });
  return result ? result.toJSON() : result;
}
