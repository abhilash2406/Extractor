import express from 'express';
import {
  getDashboardStats,
  getUserGrowth,
  getTopTemplates,
  getRecentUsers,
  getCandidateDashboardStats,
} from './controller.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';
import authorizeCandidate from '../../middlewares/authorize-candidate.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

/**
 * Admin Dashboard endpoints
 * Mounted at /api/v1/dashboard (authMiddleware already mounted in routes/index.js)
 */
router.get('/stats', authorizeAdmin, getDashboardStats);
router.get('/overview', authorizeAdmin, getDashboardStats);
router.get('/user-growth', authorizeAdmin, getUserGrowth);
router.get('/top-templates', authorizeAdmin, getTopTemplates);
router.get('/recent-users', authorizeAdmin, getRecentUsers);

/**
 * Candidate Dashboard endpoint
 */
router.get('/candidate', authMiddleware, authorizeCandidate, getCandidateDashboardStats);

export default router;
