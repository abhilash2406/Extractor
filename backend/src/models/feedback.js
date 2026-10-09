import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const Feedback = sequelize.define(
  'Feedback',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('general', 'bug', 'feature_request', 'pricing', 'support'),
      defaultValue: 'general',
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('NEW', 'IN_REVIEW', 'RESOLVED', 'CLOSED'),
      defaultValue: 'NEW',
      allowNull: false,
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'feedbacks',
  }
);

Feedback.associate = (models) => {
  Feedback.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

export default Feedback;
