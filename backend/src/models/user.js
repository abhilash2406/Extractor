import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserType } from '../common/enum/usertype-enum.js';
import { EntityType } from '../common/enum/activity-enum.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(...Object.values(UserType)),
    allowNull: false,
    defaultValue: UserType.CANDIDATE,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(EntityType)),
    allowNull: false,
    defaultValue: EntityType.ACTIVE,
  },
  profile_pic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedin_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  github_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

User.prototype.verifyPassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

User.prototype.generateAuthToken = function (rememberMe = false) {
  // Setting minutes for expiration based on rememberMe
  let numMinutes = rememberMe ? 720 : 10;
  
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      validity: this.password.concat(this.id).concat(this.email),
    },
    process.env.JWT_SECRET || 'qwerty',
    { expiresIn: numMinutes * 60 } // jwt expects expiresIn in seconds when using a number
  );
};

User.associate = (models) => {
  User.hasMany(models.Resume, { foreignKey: 'user_id', as: 'resumes' });
  User.hasMany(models.Application, { foreignKey: 'user_id', as: 'applications' });
  User.hasMany(models.Test, { foreignKey: 'user_id', as: 'tests' });
};

export default User;
