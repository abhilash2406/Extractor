import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const Template = sequelize.define(
  'Template',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Modern',
    },
    layout_config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    design_config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    tableName: 'templates',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Template.associate = (models) => {
  Template.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
  if (models.Resume) {
    Template.hasMany(models.Resume, { foreignKey: 'template_id', as: 'resumes' });
  }
};

export default Template;
