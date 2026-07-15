import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const TestAnswer = sequelize.define('TestAnswer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  test_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tests',
      key: 'id'
    }
  },
  question_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'id'
    }
  },
  selected_answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  }
}, {
  tableName: 'test_answers',
});

TestAnswer.associate = (models) => {
  TestAnswer.belongsTo(models.Test, { foreignKey: 'test_id', as: 'test' });
  TestAnswer.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
};

export default TestAnswer;
