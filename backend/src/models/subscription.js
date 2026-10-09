import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const Subscription = sequelize.define(
  'Subscription',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    plan_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(
        'ACTIVE',
        'CANCELED',
        'EXPIRED',
        'PAST_DUE'
      ),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    current_period_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    current_period_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancel_at_period_end: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    canceled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gateway: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gateway_subscription_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'subscriptions',
  }
);

Subscription.associate = (models) => {
  Subscription.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  Subscription.belongsTo(models.Plan, {
    foreignKey: 'plan_id',
    as: 'plan',
  });

  Subscription.hasMany(models.Payment, {
    foreignKey: 'subscription_id',
    as: 'payments',
  });
};

export default Subscription;
