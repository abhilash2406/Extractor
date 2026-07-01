import 'dotenv/config';
import sequelize from '../config/sequelize-config.js';
import User from '../models/user.js';
import { UserType } from '../common/enum/usertype-enum.js';
import { EntityType } from '../common/enum/activity-enum.js';
import { logger } from '../config/winston-config.js';

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected. Seeding admin user...');

    const email = process.env.ADMIN_MAIL;
    const password = process.env.ADMIN_PASS;

    if (!email || !password) {
      throw new Error('ADMIN_MAIL and ADMIN_PASS must be provided in the .env file');
    }

    // Check if user exists
    let adminUser = await User.findOne({ where: { email } });

    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        email,
        password, // The beforeCreate hook on the User model will automatically hash this!
        role: UserType.ADMIN,
        status: EntityType.ACTIVE,
        is_verified: true,
      });
      logger.info('✅ Admin user created successfully.');
    } else {
      logger.info('ℹ️ Admin user already exists.');
    }
  } catch (error) {
    logger.error(`❌ Error seeding admin user: ${error.message}`);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
