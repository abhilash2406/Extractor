import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

const AuthToken = sequelize.define('AuthToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('verify_email', 'reset_password'),
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(EntityType)),
    allowNull: false,
    defaultValue: EntityType.ACTIVE,
  }
}, {
  tableName: 'auth_tokens',
});

AuthToken.associate = (models) => {
  AuthToken.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

export default AuthToken;
