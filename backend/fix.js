import sequelize from './src/config/sequelize-config.js';

async function fix() {
  await sequelize.authenticate();
  
  await sequelize.query(`
    UPDATE questions 
    SET correct_answer = 'A' 
    WHERE correct_answer = option_a 
    AND correct_answer NOT IN ('A', 'B', 'C', 'D');
  `);
  
  await sequelize.query(`
    UPDATE questions 
    SET correct_answer = 'B' 
    WHERE correct_answer = option_b 
    AND correct_answer NOT IN ('A', 'B', 'C', 'D');
  `);
  
  await sequelize.query(`
    UPDATE questions 
    SET correct_answer = 'C' 
    WHERE correct_answer = option_c 
    AND correct_answer NOT IN ('A', 'B', 'C', 'D');
  `);
  
  await sequelize.query(`
    UPDATE questions 
    SET correct_answer = 'D' 
    WHERE correct_answer = option_d 
    AND correct_answer NOT IN ('A', 'B', 'C', 'D');
  `);
  
  console.log("Database updated successfully");
  process.exit(0);
}
fix().catch(console.error);
