import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'skills',
});

Skill.associate = (models) => {
  Skill.belongsToMany(models.JobRole, { 
    through: models.JobRequiredSkill,
    foreignKey: 'skill_id',
    otherKey: 'job_id',
    as: 'job_roles'
  });
};

export default Skill;
