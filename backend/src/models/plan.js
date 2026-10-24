import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const Plan = sequelize.define(
  'Plan',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'INR',
    },
    billing_interval: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'MONTHLY',
    },
    resume_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    ai_analyses_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    cover_letters_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    tableName: 'plans',
  }
);

Plan.associate = (models) => {
  Plan.hasMany(models.Subscription, {
    foreignKey: 'plan_id',
    as: 'subscriptions',
  });
};

export default Plan;
