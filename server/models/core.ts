import { Sequelize } from 'sequelize';
import { dbConfig } from '~~/app-config';

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
      timestamps: false,
    },
    pool: {
      max: 10,
    },
  },
);

export const initOptions = {
  sequelize,
  timestamps: false,
  freezeTableName: true,
};
