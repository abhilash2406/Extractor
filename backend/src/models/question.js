import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_a: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option_b: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option_c: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option_d: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correct_answer: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Should match option_a, option_b, option_c, or option_d exactly or hold a key identifier',
  }
}, {
  tableName: 'questions',
  hooks: {
    beforeValidate: (question) => {
      const correct = question.correct_answer;
      if (correct && !['A', 'B', 'C', 'D'].includes(correct)) {
        if (correct === question.option_a) question.correct_answer = 'A';
        else if (correct === question.option_b) question.correct_answer = 'B';
        else if (correct === question.option_c) question.correct_answer = 'C';
        else if (correct === question.option_d) question.correct_answer = 'D';
      }
    }
  }
});

Question.associate = (models) => {
  // Question.belongsTo(models.JobRole, { foreignKey: 'job_role_id', as: 'job_role' });
  Question.hasMany(models.TestAnswer, { foreignKey: 'question_id', as: 'answers' });
};

export default Question;
