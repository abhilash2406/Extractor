import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const ResumeVersion = sequelize.define('ResumeVersion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  resume_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'resumes',
      key: 'id',
    },
    comment: 'Parent resume ID',
  },
  version_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Incremental version number (1, 2, 3...)',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Resume title at the time this version was saved',
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'JSON snapshot of the resume content',
  },
  template_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'templates',
      key: 'id',
    },
    comment: 'Template used for this snapshot version',
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Optional PDF file reference for this version',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'resume_versions',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

ResumeVersion.associate = (models) => {
  ResumeVersion.belongsTo(models.Resume, { foreignKey: 'resume_id', as: 'resume' });
  if (models.Template) {
    ResumeVersion.belongsTo(models.Template, { foreignKey: 'template_id', as: 'template' });
  }
};

export default ResumeVersion;

