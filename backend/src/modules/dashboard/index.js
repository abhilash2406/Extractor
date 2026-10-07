import express from 'express';
import { getDashboardStats, getCandidateDashboardStats } from './controller.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';
import authorizeCandidate from '../../middlewares/authorize-candidate.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: APIs for admin and candidate metrics & statistics
 */

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get admin dashboard statistics
 *     description: Retrieve system-wide metrics, candidate counts, extraction stats, and recent activities.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/stats', authorizeAdmin, getDashboardStats);

/**
 * @swagger
 * /api/v1/dashboard/candidate:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get candidate dashboard statistics
 *     description: Retrieve candidate-specific application stats, test progress, and profile completion.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate stats retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/candidate', authMiddleware, authorizeCandidate, getCandidateDashboardStats);

export default router;
