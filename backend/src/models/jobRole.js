import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

const JobRole = sequelize.define('JobRole', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  min_education: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  min_experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Minimum experience required in years',
  },
  last_application_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Last date to submit an application',
  },
  status: {
    type: DataTypes.ENUM(...Object.values(EntityType)),
    allowNull: false,
    defaultValue: EntityType.ACTIVE,
  }
}, {
  tableName: 'job_roles',
});

JobRole.associate = (models) => {
  JobRole.belongsToMany(models.Skill, { 
    through: models.JobRequiredSkill,
    foreignKey: 'job_id',
    otherKey: 'skill_id',
    as: 'required_skills'
  });
  JobRole.hasMany(models.Application, { foreignKey: 'job_role_id', as: 'applications' });
};

export default JobRole;
