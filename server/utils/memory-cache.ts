/**
 * 内存缓存。
 * 通过监听文件变化来实现跨进程的缓存失效，适用于单机部署。
 */

import { fileURLToPath } from 'url';
import { resolve, join } from 'path';
import { writeFile } from 'fs/promises';
import { watch, existsSync, mkdirSync, type FSWatcher } from 'fs';

// 缓存清理信号文件目录
const cacheSignalDir = resolve(
  fileURLToPath(import.meta.url), '../../cache-signal',
);
if (!existsSync(cacheSignalDir)) {
  mkdirSync(cacheSignalDir, { recursive: true });
}

/**
 * 内存缓存类。
 */
export class MemoryCache<T> {
  /**
   * 获取数据的函数。
   */
  protected _fetchData: () => Promise<T | null>;
  /**
   * 缓存的数据。
   */
  protected _data?: T | null;
  /**
   * 缓存清理信号文件路径。
   */
  protected _cacheSignalFilePath: string;
  /**
   * 监听缓存清理信号文件变化的监听器。
   */
  protected _watcher?: FSWatcher;

  /**
   * 构造函数。
   * @param id 缓存 id。多个缓存的 id 不可重复，否则会导致清理信号紊乱。
   * @param data 要缓存的数据。
   */
  constructor(id: string, fetchData: () => Promise<T | null>) {
    this._cacheSignalFilePath = join(cacheSignalDir, id);
    this._fetchData = fetchData;
  }

  /**
   * 初始化。
   */
  async init() {
    if (!existsSync(this._cacheSignalFilePath)) {
      await this.clear();
    }
    watch(this._cacheSignalFilePath, (eventType) => {
      if (eventType === 'change') {
        this._data = undefined;
      }
    });
  }

  /**
   * 获取缓存数据。
   * @returns 缓存数据。
   */
  async get() {
    if (this._data === undefined) {
      this._data = await this._fetchData();
    }
    return this._data ?? null;
  }

  /**
   * 下发清理缓存信号。
   */
  clear() {
    return writeFile(
      this._cacheSignalFilePath,
      Date.now().toString(),
      'utf-8',
    );
  }
}
