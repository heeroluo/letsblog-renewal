/**
 * 外部链接的数据访问层。
 */

import { Op } from 'sequelize';
import {
  type LinkCreationAttrs,
  Link,
} from '../models/link.model';

/**
 * 创建外部链接记录。
 * @param data 要创建的数据。
 * @returns 已创建的记录。
 */
export async function create(data: LinkCreationAttrs) {
  const result = await Link.create(data);
  return result ? result.toJSON() : null;
}

/**
 * 更新外部链接记录。
 * @param data 要更新的数据。
 * @param id 目标记录的 id。
 * @returns 更新的记录数。
 */
export async function update(data: LinkCreationAttrs, id: number) {
  return (await Link.update(data, {
    where: {
      linkId: { [Op.eq]: id },
    },
  }))[0];
}

/**
 * 删除外部链接记录。
 * @param id 目标记录的 id。
 * @returns 删除的记录数。
 */
export function destroy(id: number) {
  return Link.destroy({
    where: {
      linkId: { [Op.eq]: id },
    },
  });
}

/**
 * 查询所有外部链接记录。
 * @returns 所有外部链接记录。
 */
export async function findAll(minWeight = 0) {
  return (
    await Link.findAll({
      where: {
        weight: {
          [Op.gte]: minWeight,
        },
      },
      order: [['weight', 'DESC']],
    })
  ).map(item => item.toJSON());
}

/**
 * 查询单条外部链接记录。
 * @param id 目标记录的 id。
 * @returns 外部链接记录。
 */
export async function findOne(id: number) {
  const result = await Link.findOne({
    where: {
      linkId: { [Op.eq]: id },
    },
  });
  return result ? result.toJSON() : result;
}
