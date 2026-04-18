/**
 * MySQL 数据库配置。
 */
export interface IDatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  timezone?: string
}
