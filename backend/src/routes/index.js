import express from 'express';
import healthRoutes from './health.js';
import authRoutes from '../api/authentication/index.js';
import jobsRoutes from '../api/jobs/index.js';
import skillsRoutes from '../api/skills/index.js';
import questionsRoutes from '../api/questions/index.js';
import usersRoutes from '../api/users/index.js';
import applicationsRoutes from '../api/applications/index.js';
import dashboardRoutes from '../api/dashboard/index.js';
import testsRoutes from '../api/tests/index.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Health Check
router.use('/', healthRoutes);

// Dashboard
router.use('/dashboard', auth, dashboardRoutes);

// Authentication
router.use('/auth', authRoutes);

// Jobs
router.use('/jobs', auth, jobsRoutes);

// Skills
router.use('/skills', auth, skillsRoutes);

// Questions
router.use('/questions', auth, questionsRoutes);

// Tests
router.use('/tests', auth, testsRoutes);

// Users (admin only)
router.use('/users', usersRoutes);

// Applications (admin only)
router.use('/applications', applicationsRoutes);

export default router;
