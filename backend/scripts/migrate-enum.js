import sequelize from '../src/config/sequelize-config.js';
import { logger } from '../src/config/winston-config.js';

const migrateEnum = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected.');

    // 1. Create the ENUM type if it doesn't exist
    logger.info('Creating ENUM type "enum_applications_status"...');
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_applications_status') THEN
          CREATE TYPE "enum_applications_status" AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
        END IF;
      END
      $$;
    `);

    // 2. Alter the column in the applications table to use this ENUM
    logger.info('Altering column "status" in "applications" table...');
    await sequelize.query(`
      ALTER TABLE "applications" 
      ALTER COLUMN "status" DROP DEFAULT,
      ALTER COLUMN "status" TYPE "enum_applications_status" 
      USING "status"::text::"enum_applications_status",
      ALTER COLUMN "status" SET DEFAULT 'pending'::"enum_applications_status";
    `);

    logger.info('Successfully migrated "status" column to ENUM!');
    process.exit(0);
  } catch (error) {
    logger.error('Error during migration:', error);
    process.exit(1);
  }
};

migrateEnum();
