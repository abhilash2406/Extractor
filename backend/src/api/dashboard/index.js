import express from 'express';
import { getDashboardStats } from './controller.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';

const router = express.Router();

router.get('/stats', authorizeAdmin, getDashboardStats);

export default router;
