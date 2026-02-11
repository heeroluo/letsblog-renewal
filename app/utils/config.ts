import appConfig from '@/app-config';
import type { IDatabaseConfig } from '../types/config';


const config = Object.assign(appConfig.common ?? {}, appConfig.local);

export function getDbConfig(): IDatabaseConfig {
  return config.db;
}
