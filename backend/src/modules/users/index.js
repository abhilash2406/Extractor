import express from 'express';
import multer from 'multer';
import { getUsers, getUser, updateUserStatus, getUserResume, getProfile, updateProfile } from './controller.js';
import auth from '../../middlewares/auth.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: APIs for user profile and administration
 */

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get logged in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details including photo URL
 *   put:
 *     tags: [Users]
 *     summary: Update logged in user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('photo'), updateProfile);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: plan
 *         schema:
 *           type: string
 *           enum: [ALL, FREE, BASIC, PRO, PREMIUM]
 *         description: Filter by subscription plan
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ALL, ACTIVE, BLOCKED]
 *         description: Filter by user status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter users joined on or after this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter users joined on or before this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of users with pagination metadata
 *       403:
 *         description: Admin access required
 */
router.get('/', auth, authorizeAdmin, getUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user details by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Detailed user profile and statistics
 *       404:
 *         description: User not found
 */
router.get('/:id', auth, authorizeAdmin, getUser);

/**
 * @swagger
 * /api/v1/users/{id}/status:
 *   put:
 *     tags: [Users]
 *     summary: Update user status (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, suspended, blocked]
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: User status updated successfully
 */
router.put('/:id/status', auth, authorizeAdmin, updateUserStatus);

/**
 * @swagger
 * /api/v1/users/{id}/resume:
 *   get:
 *     tags: [Users]
 *     summary: Download or view candidate resume (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume file / download URL
 */
router.get('/:id/resume', auth, authorizeAdmin, getUserResume);

export default router;
