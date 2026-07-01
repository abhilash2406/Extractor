import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const Resume = sequelize.define('Resume', {
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
  file: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Path or URL to the resume file',
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'resumes',
  createdAt: 'uploaded_at', // Map uploaded_at to createdAt
  updatedAt: 'updated_at',
});

Resume.associate = (models) => {
  Resume.belongsTo(models.User, { foreignKey: 'user_id', as: 'candidate' });
  Resume.hasOne(models.ResumeAnalysis, { foreignKey: 'resume_id', as: 'analysis' });
};

export default Resume;
