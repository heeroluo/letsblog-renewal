import type { IAppConfig } from './types/config';

export default {
  local: {
    db: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456',
      database: 'mrluoblog',
      timezone: '+08:00'
    }
  }
} as { [key: string]: IAppConfig };
