import Question from '../../models/question.js';
import BadRequest from '../../common/exceptions/badRequest.js';
import { Op } from 'sequelize';
import { parsePagination, paginatedResponse } from '../../utils/pagination.js';
import { generateQuestionWithGroq } from '../../utils/groqUtil.js';
export const createQuestionService = async (data) => {
  return await Question.create(data);
};

export const getQuestionsService = async (query = {}) => {
  const { page, limit, offset, sortBy, sortOrder, search } = parsePagination(query, 'created_at');

  const where = {};
  if (search) {
    where.question = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows } = await Question.findAndCountAll({
    where,
    order: [[sortBy, sortOrder]],
    limit,
    offset,
  });

  return paginatedResponse(rows, count, page, limit);
};

export const getQuestionByIdService = async (id) => {
  const question = await Question.findOne({ where: { id } });
  if (!question) throw new BadRequest('Question not found');
  return question;
};

export const updateQuestionService = async (id, data) => {
  const question = await Question.findOne({ where: { id } });

  if (!question) {
    throw new BadRequest('Question not found');
  }

  return await question.update(data);
};

export const deleteQuestionService = async (id) => {
  const question = await Question.findOne({ where: { id } });

  if (!question) {
    throw new BadRequest('Question not found');
  }

  await question.destroy();
  return { message: 'Question deleted successfully' };
};

export const generateQuestionService = async (topic, difficulty) => {
  const questions = await generateQuestionWithGroq(topic, difficulty);
  if (!questions || questions.length === 0) {
    throw new BadRequest('Failed to generate questions. Please try again.');
  }
  
  await Question.bulkCreate(questions);
  return { message: `Successfully generated and saved ${questions.length} questions.` };
};
