/**
 * 分类的数据访问层。
 */

import { Op } from 'sequelize';
import {
  type CategoryCreationAttrs,
  Category,
} from '#server/models/category.model';

/**
 * 创建分类记录。
 * @param data 要创建的数据。
 * @returns 已创建的记录。
 */
export async function create(data: CategoryCreationAttrs) {
  const result = await Category.create(data);
  return result ? result.toJSON() : null;
}

/**
 * 更新分类记录。
 * @param data 要更新的数据。
 * @param id 目标记录的 id。
 * @returns 更新的记录数。
 */
export async function update(data: CategoryCreationAttrs, id: number) {
  return (
    await Category.update(data, {
      where: {
        categoryId: { [Op.eq]: id },
      },
    })
  )[0];
}

/**
 * 删除分类记录。
 * @param id 目标记录的 id。
 * @returns 删除的记录数。
 */
export function destroy(id: number) {
  return Category.destroy({
    where: {
      categoryId: { [Op.eq]: id },
    },
  });
}

/**
 * 查询所有分类记录。
 * @returns 所有分类记录。
 */
export async function findAll() {
  return (await Category.findAll({
    order: [['weight', 'DESC']],
  })).map(item => item.toJSON());
}

/**
 * 查询单条分类记录。
 * @param id 目标记录的 id。
 * @returns 分类记录。
 */
export async function findOne(id: number) {
  const result = await Category.findOne({
    where: {
      categoryId: { [Op.eq]: id },
    },
  });
  return result ? result.toJSON() : null;
}
