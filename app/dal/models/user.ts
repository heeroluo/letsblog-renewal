/**
 * 用户数据访问层。
 */

import type {
  InferAttributes,
  InferCreationAttributes,
  Attributes,
  CreationOptional,
  WhereOptions
} from 'sequelize';
import { Model, DataTypes, Op } from 'sequelize';
import { sequelize } from '../core';
import { UserGroup } from './usergroup';


/**
 * 用户模型。
 */
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  /**
   * 用户 ID。
   */
  declare userid: CreationOptional<number>;
  /**
   * 用户名。
   */
  declare username: string;
  /**
   * 密码。
   */
  declare password: string;
  /**
   * 所属用户组的 ID。
   */
  declare groupid: number;
  /**
   * 昵称。
   */
  declare nickname: string;
  /**
   * 电子邮件。
   */
  declare email: string;
  /**
   * 注册时间。
   */
  declare regtime: Date;
  /**
   * 最后活动时间。
   */
  declare lastactivity: Date;
  /**
   * 最后活动 IP。
   */
  declare lastip: string;
  /**
   * 总文章数。
   */
  declare totalarticles: CreationOptional<number>;
  /**
   * 总评论数。
   */
  declare totalcomments: CreationOptional<number>;
}

User.init({
  userid: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  username: { type: DataTypes.STRING },
  password: { type: DataTypes.CHAR },
  groupid: { type: DataTypes.SMALLINT.UNSIGNED },
  nickname: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  regtime: { type: DataTypes.DATE },
  lastactivity: { type: DataTypes.DATE },
  lastip: { type: DataTypes.STRING },
  totalarticles: { type: DataTypes.INTEGER.UNSIGNED },
  totalcomments: { type: DataTypes.BIGINT.UNSIGNED }
}, {
  sequelize,
  tableName: 'user',
  timestamps: false,
  freezeTableName: true,
  getterMethods: {
    name() {
      return this.nickname || this.username;
    }
  }
});

User.belongsTo(UserGroup, {
  foreignKey: 'groupid'
});

/**
 * 用户的属性。
 */
export type UserAttrs = Attributes<User>;


/**
 * 创建用户记录。
 * @param data 要创建的记录。
 * @returns 已创建的用户记录。
 */
export async function create(
  data: Pick<UserAttrs, 'username' | 'password' | 'groupid' | 'nickname' | 'email' | 'regtime' | 'lastactivity' | 'lastip'>
) {
  const result = await User.create(data, {
    fields: [
      'username',
      'password',
      'groupid',
      'nickname',
      'email',
      'regtime',
      'lastactivity',
      'lastip'
    ]
  });
  return result ? result.toJSON() : null;
}

/**
 * 根据用户 ID 读取用户记录。
 * @param id 用户 ID。
 * @returns 用户记录。
 */
export async function readByUserId(id: number) {
  const result = await User.findOne({
    where: {
      userid: { [Op.eq]: id }
    }
  });
  return result ? result.toJSON() : result;
}

/**
 * 根据用户名、密码读取用户记录。
 * @param username 用户名。
 * @param password 密码。如果为空，则只根据用户名读取。
 * @returns 用户记录。
 */
export async function readByUsername(username: string, password?: string) {
  const where: WhereOptions<User> = {
    username: { [Op.eq]: username }
  };
  if (password != null) {
    where.password = { [Op.eq]: password };
  }
  const result = await User.findOne({ where });
  return result ? result.toJSON() : result;
}

/**
 * 更新用户记录中的个人资料字段。
 * @param data 要更新的字段和数据。
 * @param id 要更新的用户记录的 ID。
 * @returns 更新的记录数。
 */
export async function updateProfile(data: Pick<User, 'groupid' | 'nickname' | 'email'>, id: number) {
  return (await User.update(data, {
    fields: [
      'groupid',
      'nickname',
      'email'
    ],
    where: {
      userid: { [Op.eq]: id }
    }
  }))[0];
};

/**
 * 更新用户记录中的活动字段。
 * @param lastactivity 最后活动时间。
 * @param lastip 最后活动 IP。
 * @param id 要更新的用户记录的 ID。
 * @returns 更新的记录数。
 */
export async function updateActivity(
  lastactivity: Date, lastip: string, id: number
) {
  return (await User.update({
    lastactivity,
    lastip
  }, {
    where: {
      userid: { [Op.eq]: id }
    }
  }))[0];
};

/**
 * 更新用户记录中的密码字段。
 * @param password 新密码。
 * @param username 要更新的用户记录的 ID。
 * @returns 更新的记录数。
 */
export async function updatePassword(password: string, username: string) {
  return (await User.update({
    password
  }, {
    where: {
      username: { [Op.eq]: username }
    }
  }))[0];
};

/**
 * 删除用户记录。
 * @param ids 要删除的用户记录的 ID。
 * @returns 删除的记录数。
 */
export async function destroy(ids: number[]) {
  return User.destroy({
    where: {
      userid: {
        [Op.in]: ids
      }
    }
  });
};

/**
 * 根据用户名或昵称查询用户记录。
 * @param username 用户名。
 * @param nickname 昵称。
 * @returns 查询结果。
 */
export async function getListByName(username?: string, nickname?: string) {
  const names: string[] = [];
  if (username) { names.push(username); }
  if (nickname) { names.push(nickname); }

  return (await User.findAll({
    where: {
      [Op.or]: {
        username: {
          [Op.in]: names
        },
        nickname: {
          [Op.in]: names
        }
      }
    }
  })).map((item) => item.toJSON());
};

/**
 * 根据特定条件查询用户记录。
 * @param pageSize 每页记录数。
 * @param page 页码。
 * @param params 查询参数。
 * @returns 查询结果。
 */
export async function getList(
  pageSize: number, page: number, params: { groupid?: number, name?: string }
) {
  const where: WhereOptions<UserAttrs> = {};
  if (params) {
    if (params.groupid) {
      where.groupid = {
        [Op.eq]: params.groupid
      };
    }
    if (params.name) {
      (<any>where)[Op.or] = {
        username: {
          [Op.like]: `%${params.name}%`
        },
        nickname: {
          [Op.like]: `%${params.name}%`
        }
      };
    }
  }

  const result = await User.findAndCountAll({
    where,
    attributes: {
      exclude: ['password']
    },
    include: [{
      model: UserGroup,
      attributes: ['groupname']
    }],
    order: [['userid', 'DESC']],
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
