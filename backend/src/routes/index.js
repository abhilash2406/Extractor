import express from 'express';
import healthRoutes from './health.js';
import authRoutes from '../modules/authentication/index.js';
import usersRoutes from '../modules/users/index.js';
import dashboardRoutes from '../modules/dashboard/index.js';
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

export default router;
