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
    allowNull: true,
    comment: 'Path or URL to the resume file',
  },
  template_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'templates',
      key: 'id',
    },
    comment: 'ID of the template used for this resume',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Untitled Resume',
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'JSON resume data when built using template builder',
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
  if (models.Template) {
    Resume.belongsTo(models.Template, { foreignKey: 'template_id', as: 'template' });
  }
};

export default Resume;
