import Test from '../../models/test.js';
import TestAnswer from '../../models/testAnswer.js';
import Question from '../../models/question.js';
import Application from '../../models/application.js';
import JobRole from '../../models/jobRole.js';

export const getMyTestsService = async (userId) => {
  return await Test.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Application,
        as: 'application',
        include: [
          {
            model: JobRole,
            as: 'job_role',
            attributes: ['id', 'title']
          }
        ]
      }
    ],
    order: [['assigned_at', 'DESC']]
  });
};

export const getTestByIdService = async (testId, userId) => {
  const test = await Test.findOne({
    where: { id: testId, user_id: userId },
    include: [
      {
        model: TestAnswer,
        as: 'answers',
        include: [
          {
            model: Question,
            as: 'question',
            attributes: ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d'] // EXCLUDE correct_answer!
          }
        ]
      }
    ]
  });

  if (!test) {
    throw new Error('Test not found or access denied');
  }

  return test;
};

export const submitTestAnswersService = async (testId, userId, answers) => {
  const test = await Test.findOne({
    where: { id: testId, user_id: userId },
    include: [
      {
        model: TestAnswer,
        as: 'answers',
        include: [{ model: Question, as: 'question' }]
      }
    ]
  });

  if (!test) {
    throw new Error('Test not found');
  }
  
  if (test.is_completed) {
    throw new Error('Test has already been submitted');
  }

  let correctCount = 0;
  
  // Map of submitted answers by test_answer_id
  const submissionMap = {};
  answers.forEach(a => {
    submissionMap[a.answerId] = a.selectedAnswer;
  });

  for (const answerRecord of test.answers) {
    const selected = submissionMap[answerRecord.id];
    answerRecord.selected_answer = selected || null;
    
    // Check correctness
    if (selected && answerRecord.question) {
      if (selected === answerRecord.question.correct_answer) {
        answerRecord.is_correct = true;
        correctCount++;
      } else {
        answerRecord.is_correct = false;
      }
    } else {
      answerRecord.is_correct = false;
    }
    
    await answerRecord.save();
  }

  test.score = (correctCount / test.total_questions) * 100;
  test.is_completed = true;
  test.submitted_at = new Date();
  
  await test.save();
  return test;
};
