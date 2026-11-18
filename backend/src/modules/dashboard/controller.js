import { goodResponse, failedResponse } from '../../common/response.js';
import {
  getDashboardStatsService,
  getUserGrowthService,
  getTopTemplatesService,
  getRecentUsersService,
  getCandidateDashboardStatsService,
} from './service.js';

export const getDashboardStats = async (req, res) => {
  try {
    const data = await getDashboardStatsService();
    return res.json(goodResponse({ data }, 'Dashboard stats retrieved successfully'));
  } catch (error) {
    const status = error.statusCode || error.status || 500;
    return res.status(status).json(failedResponse(error.message, status, error.name || 'Error'));
  }
};

export const getUserGrowth = async (req, res) => {
  try {
    const months = parseInt(req.query.months, 10) || 10;
    const data = await getUserGrowthService(months);
    return res.json(goodResponse({ data }, 'User growth retrieved successfully'));
  } catch (error) {
    const status = error.statusCode || error.status || 500;
    return res.status(status).json(failedResponse(error.message, status, error.name || 'Error'));
  }
};

export const getTopTemplates = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const data = await getTopTemplatesService(limit);
    return res.json(goodResponse({ data }, 'Top templates retrieved successfully'));
  } catch (error) {
    const status = error.statusCode || error.status || 500;
    return res.status(status).json(failedResponse(error.message, status, error.name || 'Error'));
  }
};

export const getRecentUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const data = await getRecentUsersService(limit);
    return res.json(goodResponse({ data }, 'Recent users retrieved successfully'));
  } catch (error) {
    const status = error.statusCode || error.status || 500;
    return res.status(status).json(failedResponse(error.message, status, error.name || 'Error'));
  }
};

export const getCandidateDashboardStats = async (req, res) => {
  try {
    const data = await getCandidateDashboardStatsService(req.user.id);
    return res.json(goodResponse({ data }, 'Candidate stats retrieved successfully'));
  } catch (error) {
    const status = error.statusCode || error.status || 500;
    return res.status(status).json(failedResponse(error.message, status, error.name || 'Error'));
  }
};
