import type { IDatabaseConfig } from '#shared/types/config';

export const dbConfig: IDatabaseConfig = {
  host: process.env.LETSBLOG_DB_HOST || 'localhost',
  port: Number(process.env.LETSBLOG_DB_PORT) || 3306,
  user: process.env.LETSBLOG_DB_USER || 'root',
  password: process.env.LETSBLOG_DB_PWD || '123456',
  database: process.env.LETSBLOG_DB_DATABASE || 'mrluoblog',
  timezone: process.env.LETSBLOG_DB_TIMEZONE || '+08:00',
};
