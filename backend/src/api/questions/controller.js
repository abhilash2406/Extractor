import {
  createQuestionService,
  getQuestionsService,
  getQuestionByIdService,
  updateQuestionService,
  deleteQuestionService,
  generateQuestionService,
} from './service.js';

export const createQuestion = async (req, res, next) => {
  try {
    const data = await createQuestionService(req.body);
    return res.status(201).json({ success: true, message: 'Question created successfully', data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const result = await getQuestionsService(req.query);
    return res.json({ success: true, ...result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const data = await getQuestionByIdService(req.params.id);
    return res.json({ success: true, data });
  } catch (e) {
    const status = e.message === 'Question not found' ? 404 : 400;
    return res.status(status).json({ success: false, message: e.message });
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const data = await updateQuestionService(req.params.id, req.body);
    return res.json({ success: true, message: 'Question updated successfully', data });
  } catch (e) {
    const status = e.message === 'Question not found' ? 404 : 400;
    return res.status(status).json({ success: false, message: e.message });
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const data = await deleteQuestionService(req.params.id);
    return res.json({ success: true, message: data.message });
  } catch (e) {
    const status = e.message === 'Question not found' ? 404 : 400;
    return res.status(status).json({ success: false, message: e.message });
  }
};

export const generateQuestion = async (req, res, next) => {
  try {
    const { topic, difficulty } = req.body;
    if (!topic || !difficulty) throw new Error('Topic and difficulty are required');
    
    const data = await generateQuestionService(topic, difficulty);
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
