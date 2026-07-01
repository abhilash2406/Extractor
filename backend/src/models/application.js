import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { ApplicationStatus } from '../common/enum/application-status-enum.js';

const Application = sequelize.define('Application', {
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
  job_role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'job_roles',
      key: 'id'
    }
  },
  match_score: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'AI computed match score percentage',
  },
  matched_skills: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  missing_skills: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
    allowNull: false,
    defaultValue: ApplicationStatus.PENDING,
  },
  applied_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'applications',
  createdAt: 'applied_at',
  updatedAt: 'updated_at',
});

Application.associate = (models) => {
  Application.belongsTo(models.JobRole, { foreignKey: 'job_role_id', as: 'job_role' });
  Application.belongsTo(models.User, { foreignKey: 'user_id', as: 'candidate' });
  Application.hasOne(models.Test, { foreignKey: 'application_id', as: 'test' });
};

export default Application;
