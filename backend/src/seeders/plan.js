import sequelize from '../config/sequelize-config.js';
import User from '../models/user.js';
import Plan from '../models/plan.js';
import Subscription from '../models/subscription.js';
import Payment from '../models/payment.js';
import { logger } from '../config/winston-config.js';

const syncAndSeed = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connected to DB');

    // Add last_login_at to users table if not present
    await sequelize.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_login_at" TIMESTAMP WITH TIME ZONE;');
    logger.info('Column last_login_at verified on users table');

    // Sync models
    await Plan.sync({ alter: true });
    logger.info('Plan table synced');

    await Subscription.sync({ alter: true });
    logger.info('Subscription table synced');

    await Payment.sync({ alter: true });
    logger.info('Payment table synced');

    // Seed default FREE plan only
    const defaultPlans = [
      {
        code: 'FREE',
        name: 'Free',
        price: 0.00,
        currency: 'INR',
        billing_interval: 'MONTHLY',
        resume_limit: 3,
        ai_analyses_limit: 3,
        cover_letters_limit: 1,
        is_active: true,
        features: {
          ats_scanner: true,
          basic_templates: true,
          ai_rewriting: false,
          pdf_export: true,
          priority_support: false,
        },
      },
    ];

    for (const plan of defaultPlans) {
      const existing = await Plan.findOne({ where: { code: plan.code } });
      if (!existing) {
        await Plan.create(plan);
        logger.info(`Created plan: ${plan.name}`);
      } else {
        await existing.update({ resume_limit: 3 });
        logger.info(`Plan already exists, updated resume_limit: ${plan.name}`);
      }
    }

    logger.info('✅ FREE Plan and tables setup successfully!');
    process.exit(0);
  } catch (err) {
    logger.error(`❌ Error during sync/seed: ${err.message || err}`);
    process.exit(1);
  }
};

syncAndSeed();
