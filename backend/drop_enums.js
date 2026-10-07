import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('extractor_db', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
});

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected. Dropping public schema...');
    await sequelize.query('DROP SCHEMA public CASCADE;');
    await sequelize.query('CREATE SCHEMA public;');
    console.log('Public schema dropped and recreated.');
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

run();
