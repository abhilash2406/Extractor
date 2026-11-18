import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const FeatureCounter = sequelize.define(
  'FeatureCounter',
  {
    key: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
    },
    count: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'feature_counters',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export const FEATURE_COUNTER_KEYS = {
  COVER_LETTER_GENERATED: 'cover_letter_generated',
};

/**
 * Atomically increments a feature counter in PostgreSQL (zero content stored).
 */
export const incrementFeatureCounter = async (key, by = 1) => {
  await sequelize.query(
    `INSERT INTO feature_counters ("key", "count", "created_at", "updated_at")
     VALUES (:key, :by, NOW(), NOW())
     ON CONFLICT ("key")
     DO UPDATE SET "count" = feature_counters."count" + :by, "updated_at" = NOW()`,
    { replacements: { key, by } }
  );
};

/**
 * Reads a feature counter value as an integer (returns 0 if not yet initialized).
 */
export const getFeatureCounter = async (key) => {
  const row = await FeatureCounter.findByPk(key, { attributes: ['count'] });
  return row ? parseInt(row.count, 10) || 0 : 0;
};

export default FeatureCounter;
