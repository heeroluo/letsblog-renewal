import {
  validateAndThrow,
  validateIdAndThrow,
} from '#shared/utils/validator/validator';
import {
  validate,
  INVALID_ID_MSG,
} from '#shared/utils/validator/models/category';
import { ErrorCode } from '#shared/utils/app-error';
import {
  create as createRecord,
  update as updateRecord,
  findAll as findAllRecords,
  destroy as destroyRecord,
} from '#server/repositories/category.repo';
import type { CategoryAttrs, CategoryCreationAttrs } from '#server/models/category.model';
import { MemoryCache } from '#server/utils/memory-cache';

// 缓存所有分类
let cache: MemoryCache<CategoryAttrs[]>;

/**
 * 创建分类。
 * @param data 分类数据。
 * @returns 已创建的分类。
 */
export async function create(data: CategoryCreationAttrs) {
  validateAndThrow(() => validate(data), ErrorCode.BadRequest);
  const result = await createRecord(data);
  if (cache) {
    await cache.clear();
  }
  return result;
}

/**
 * 更新分类。
 * @param data 分类数据。
 * @param id 分类编号。
 */
export async function update(data: CategoryCreationAttrs, id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  validateAndThrow(() => validate(data), ErrorCode.BadRequest);
  await updateRecord(data, id);
}

/**
 * 删除分类。
 * @param id 分类编号。
 * @returns
 */
export async function destroy(id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  await destroyRecord(id);
}

/**
 * 查询所有分类。
 * @returns 所有分类。
 */
export async function findAll() {
  if (!cache) {
    cache = new MemoryCache('category:all', () => {
      return findAllRecords();
    });
  }
  return cache.get();
}

/**
 * 查询单个分类。
 * @param id 分类编号。
 * @returns 分类。
 */
export async function findOne(id: number) {
  validateIdAndThrow(id, INVALID_ID_MSG);
  const categoryList = await findAll();
  if (categoryList) {
    for (let i = categoryList.length - 1; i >= 0; i--) {
      const item = categoryList[i];
      if (item?.categoryId === id) {
        return item;
      }
    }
  }
  return null;
}
