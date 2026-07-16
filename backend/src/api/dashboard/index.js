import express from 'express';
import { getDashboardStats, getCandidateDashboardStats } from './controller.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';
import authorizeCandidate from '../../middlewares/authorize-candidate.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

router.get('/stats', authorizeAdmin, getDashboardStats);
router.get('/candidate', authMiddleware, authorizeCandidate, getCandidateDashboardStats);

export default router;
