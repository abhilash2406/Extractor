import { goodResponse, failedResponse } from '../../common/response.js';
import { getDashboardStatsService, getCandidateDashboardStatsService } from './service.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const data = await getDashboardStatsService();
    return res.json(goodResponse({ data }, 'Dashboard stats retrieved successfully'));
  } catch (error) {
    const status = error.statusCode || error.status || 500;
    return res.status(status).json(failedResponse(error.message, status, error.name || 'Error'));
  }
};

export const getCandidateDashboardStats = async (req, res, next) => {
  try {
    const data = await getCandidateDashboardStatsService(req.user.id);
    return res.json(goodResponse({ data }, 'Candidate stats retrieved successfully'));
  } catch (error) {
    const status = error.statusCode || error.status || 500;
    return res.status(status).json(failedResponse(error.message, status, error.name || 'Error'));
  }
};
