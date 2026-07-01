import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const ResumeAnalysis = sequelize.define('ResumeAnalysis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  resume_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // One-to-One relationship with Resume
    references: {
      model: 'resumes',
      key: 'id'
    }
  },
  extracted_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  extracted_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  education: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  experience: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  projects: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  certifications: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  extracted_skills: {
    type: DataTypes.JSONB,
    allowNull: true,
  }
}, {
  tableName: 'resume_analyses',
});

ResumeAnalysis.associate = (models) => {
  ResumeAnalysis.belongsTo(models.Resume, { foreignKey: 'resume_id', as: 'resume' });
};

export default ResumeAnalysis;
