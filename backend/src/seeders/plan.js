import sequelize from '../config/sequelize-config.js';
import User from '../models/user.js';
import Plan from '../models/plan.js';
import Subscription from '../models/subscription.js';
import Payment from '../models/payment.js';

const syncAndSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Add last_login_at to users table if not present
    await sequelize.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_login_at" TIMESTAMP WITH TIME ZONE;');
    console.log('Column last_login_at verified on users table');

    // Sync models
    await Plan.sync({ alter: true });
    console.log('Plan table synced');

    await Subscription.sync({ alter: true });
    console.log('Subscription table synced');

    await Payment.sync({ alter: true });
    console.log('Payment table synced');

    // Seed default FREE plan only
    const defaultPlans = [
      {
        code: 'FREE',
        name: 'Free',
        price: 0.00,
        currency: 'INR',
        billing_interval: 'MONTHLY',
        resume_limit: 1,
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
        console.log(`Created plan: ${plan.name}`);
      } else {
        console.log(`Plan already exists: ${plan.name}`);
      }
    }

    console.log('✅ FREE Plan and tables setup successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during sync/seed:', err);
    process.exit(1);
  }
};

syncAndSeed();
