import * as testService from './service.js';

export const getMyTests = async (req, res, next) => {
  try {
    const tests = await testService.getMyTestsService(req.user.id);
    res.json({ success: true, data: tests });
  } catch (error) {
    next(error);
  }
};

export const getTestById = async (req, res, next) => {
  try {
    const test = await testService.getTestByIdService(req.params.id, req.user.id);
    res.json({ success: true, data: test });
  } catch (error) {
    next(error);
  }
};

export const getAdminTestById = async (req, res, next) => {
  try {
    const test = await testService.getAdminTestByIdService(req.params.id);
    res.json({ success: true, data: test });
  } catch (error) {
    next(error);
  }
};
export const submitTestAnswers = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const test = await testService.submitTestAnswersService(req.params.id, req.user.id, answers);
    res.json({ success: true, message: 'Test submitted successfully', data: test });
  } catch (error) {
    next(error);
  }
};

export const evaluateTestController = async (req, res, next) => {
  try {
    const test = await testService.evaluateTechnicalTestService(req.params.id);
    res.json({ success: true, message: 'Test evaluated successfully', data: test });
  } catch (error) {
    next(error);
  }
};
