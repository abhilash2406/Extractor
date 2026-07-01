import { Sequelize } from 'sequelize';
import 'dotenv/config';
import { logger } from './winston-config.js';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'extractor_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: (msg) => logger.info(`[Sequelize] ${msg}`),
    define: {
      timestamps: true,
      underscored: true, // Use snake_case for db columns (e.g. created_at instead of createdAt)
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
