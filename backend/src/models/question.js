import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('MCQ', 'PROGRAMMING'),
    defaultValue: 'MCQ',
    allowNull: false,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_a: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  option_b: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  option_c: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  option_d: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  correct_answer: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Should match option_a, option_b, option_c, or option_d exactly or hold a key identifier',
  }
}, {
  tableName: 'questions',
  hooks: {
    beforeValidate: (question) => {
      if (question.type === 'MCQ') {
        const correct = question.correct_answer;
        if (correct && !['A', 'B', 'C', 'D'].includes(correct)) {
          if (correct === question.option_a) question.correct_answer = 'A';
          else if (correct === question.option_b) question.correct_answer = 'B';
          else if (correct === question.option_c) question.correct_answer = 'C';
          else if (correct === question.option_d) question.correct_answer = 'D';
        }
      } else if (question.type === 'PROGRAMMING') {
        question.option_a = null;
        question.option_b = null;
        question.option_c = null;
        question.option_d = null;
        question.correct_answer = null;
      }
    }
  }
});

Question.associate = (models) => {
  // Question.belongsTo(models.JobRole, { foreignKey: 'job_role_id', as: 'job_role' });
  Question.hasMany(models.TestAnswer, { foreignKey: 'question_id', as: 'answers' });
};

export default Question;
