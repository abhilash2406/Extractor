import { Question } from './src/models/index.js';
import { db } from './src/models/index.js';

async function fix() {
  await db.authenticate();
  const questions = await Question.findAll();
  let updatedCount = 0;

  for (let q of questions) {
    if (!['A', 'B', 'C', 'D'].includes(q.correct_answer)) {
      let correct = null;
      if (q.correct_answer === q.option_a) correct = 'A';
      else if (q.correct_answer === q.option_b) correct = 'B';
      else if (q.correct_answer === q.option_c) correct = 'C';
      else if (q.correct_answer === q.option_d) correct = 'D';

      if (correct) {
        q.correct_answer = correct;
        await q.save();
        updatedCount++;
        console.log(`Fixed question ${q.id}: -> ${correct}`);
      } else {
        console.log(`Could not fix question ${q.id}: ${q.correct_answer}`);
      }
    }
  }
  console.log(`Fixed ${updatedCount} questions.`);
  process.exit(0);
}

fix().catch(console.error);
