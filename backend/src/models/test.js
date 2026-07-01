import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const Test = sequelize.define('Test', {
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
      key: 'id'
    }
  },
  application_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'applications',
      key: 'id'
    }
  },
  total_questions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'tests',
});

Test.associate = (models) => {
  Test.belongsTo(models.User, { foreignKey: 'user_id', as: 'candidate' });
  Test.belongsTo(models.Application, { foreignKey: 'application_id', as: 'application' });
  Test.hasMany(models.TestAnswer, { foreignKey: 'test_id', as: 'answers' });
};

export default Test;
