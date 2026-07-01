import 'dotenv/config';
import sequelize from '../src/config/sequelize-config.js';
import '../src/models/index.js'; // Ensure all models and associations are loaded

(async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    // Sync specifically the Tests and TestAnswers tables
    console.log('Syncing Test model...');
    await sequelize.models.Test.sync({ alter: true });
    
    console.log('Syncing TestAnswer model...');
    await sequelize.models.TestAnswer.sync({ alter: true });
    
    console.log('Successfully created tests and test_answers tables!');
  } catch (err) {
    console.error('Failed to sync tables:', err);
  }
  process.exit(0);
})();
