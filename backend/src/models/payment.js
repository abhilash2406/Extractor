import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const Payment = sequelize.define(
  'Payment',
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
    subscription_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'subscriptions',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'INR',
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'REFUNDED'
      ),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    payment_gateway: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gateway_order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gateway_payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'payments',
  }
);

Payment.associate = (models) => {
  Payment.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  Payment.belongsTo(models.Subscription, {
    foreignKey: 'subscription_id',
    as: 'subscription',
  });
};

export default Payment;
