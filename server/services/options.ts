import { validateAndThrow } from '#shared/utils/validator/validator';
import { validate } from '#shared/utils/validator/models/options';
import { ErrorCode } from '#shared/utils/app-error';
import {
  findOne as findOneOptionsRecord,
  update as updateOptionsRecord,
} from '#server/repositories/options.repo';
import type { OptionsAttrs } from '#server/models/options.model';
import { MemoryCache } from '#server/utils/memory-cache';

// 缓存站点设置
let cache: MemoryCache<OptionsAttrs>;

/**
 * 查询唯一的站点设置。
 */
export async function findOne() {
  if (!cache) {
    cache = new MemoryCache('options', () => {
      return findOneOptionsRecord();
    });
    await cache.init();
  }
  return cache.get();
}

/**
 * 更新站点设置。
 * @param options 站点设置数据。
 */
export async function update(data: OptionsAttrs) {
  validateAndThrow(() => validate(data), ErrorCode.BadRequest);
  await updateOptionsRecord(data);
  if (cache) {
    await cache.clear();
  }
}
