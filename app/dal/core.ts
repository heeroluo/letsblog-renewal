import { Sequelize } from 'sequelize';
import { getDbConfig } from '../utils/config';

const dbConfig = getDbConfig();

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    timezone: dbConfig.timezone,
    define: {
      freezeTableName: true,
      timestamps: false
    },
    pool: {
      max: 10
    }
  }
);
