import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const JobRequiredSkill = sequelize.define('JobRequiredSkill', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  job_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'job_roles',
      key: 'id'
    }
  },
  skill_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'skills',
      key: 'id'
    }
  }
}, {
  tableName: 'job_required_skills',
});

JobRequiredSkill.associate = (models) => {
  // Associations are typically defined on the target models for many-to-many,
  // but if needed, we can also define them here.
  JobRequiredSkill.belongsTo(models.JobRole, { foreignKey: 'job_id' });
  JobRequiredSkill.belongsTo(models.Skill, { foreignKey: 'skill_id' });
};

export default JobRequiredSkill;
