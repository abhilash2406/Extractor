import express from 'express';
import healthRoutes from './health.js';
import authRoutes from '../modules/authentication/index.js';
import usersRoutes from '../modules/users/index.js';
import dashboardRoutes from '../modules/dashboard/index.js';
import templatesRoutes from '../modules/templates/index.js';
import resumesRoutes from '../modules/resumes/index.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Health Check
router.use('/', healthRoutes);

// Dashboard
router.use('/dashboard', auth, dashboardRoutes);

// Authentication
router.use('/auth', authRoutes);

// Users (admin only)
router.use('/users', usersRoutes);

// Templates (public candidate view & admin management)
router.use('/templates', templatesRoutes);

// Resumes (user creation, saving, and PDF generation)
router.use('/resumes', resumesRoutes);

export default router;
