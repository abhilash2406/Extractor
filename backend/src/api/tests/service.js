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
            attributes: ['id', 'question', 'type', 'option_a', 'option_b', 'option_c', 'option_d'] // EXCLUDE correct_answer!
          }
        ]
      }
    ]
  });

  if (!test) {
    throw new Error('Test not found or access denied');
  }

  // Prevent exposing questions, correct answers, and selected answers after the test is submitted
  if (test.is_completed) {
    delete test.dataValues.answers;
  }

  return test;
};

export const getAdminTestByIdService = async (testId) => {
  const test = await Test.findOne({
    where: { id: testId },
    include: [
      {
        model: TestAnswer,
        as: 'answers',
        include: [
          {
            model: Question,
            as: 'question',
          }
        ]
      }
    ]
  });

  if (!test) {
    throw new Error('Test not found');
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
    submissionMap[a.answerId] = {
      selectedAnswer: a.selectedAnswer,
      language: a.language || null
    };
  });

  for (const answerRecord of test.answers) {
    const submission = submissionMap[answerRecord.id];
    const selected = submission?.selectedAnswer;
    const language = submission?.language;
    
    answerRecord.selected_answer = selected || null;
    if (language) answerRecord.language = language;
    
    // Check correctness for MCQ
    if (selected && answerRecord.question) {
      const q = answerRecord.question;
      if (q.type === 'MCQ') {
        let correctValue = q.correct_answer;
        
        // Map 'A', 'B', 'C', 'D' to the actual option text
        if (['A', 'B', 'C', 'D'].includes(q.correct_answer)) {
          const optionKey = 'option_' + q.correct_answer.toLowerCase();
          correctValue = q[optionKey];
        }

        if (selected === correctValue) {
          answerRecord.is_correct = true;
          correctCount++;
        } else {
          answerRecord.is_correct = false;
        }
      } else {
        // Programming question: we don't automatically grade it
        answerRecord.is_correct = null; 
      }
    } else {
      answerRecord.is_correct = false;
    }
    
    await answerRecord.save();
  }

  // Calculate score if it's an aptitude test
  if (test.test_type === 'APTITUDE') {
    test.score = (correctCount / test.total_questions) * 100;
  } else {
    // Technical round has manual scoring or no automatic score
    test.score = null;
  }
  
  test.is_completed = true;
  test.submitted_at = new Date();
  
  await test.save();
  return test;
};

export const evaluateTechnicalTestService = async (testId) => {
  const test = await Test.findOne({
    where: { id: testId },
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
  
  if (test.test_type !== 'TECHNICAL') {
    throw new Error('Only technical tests can be evaluated using AI');
  }

  if (test.score !== null) {
    throw new Error('Test has already been evaluated');
  }

  // Import dynamically to avoid circular dependencies if any, though it should be fine at top level
  const { evaluateTechnicalTestWithGroq } = await import('../../utils/groqUtil.js');

  const answersToEvaluate = test.answers.map(ans => ({
    question: ans.question?.question,
    language: ans.language,
    selected_answer: ans.selected_answer
  }));

  const aiResult = await evaluateTechnicalTestWithGroq(answersToEvaluate);
  
  if (aiResult && typeof aiResult.score === 'number') {
    test.score = aiResult.score;
    await test.save();
    return test;
  }
  
  throw new Error('Failed to evaluate test');
};
