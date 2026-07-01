import express from 'express';
import multer from 'multer';
import { getUsers, updateUserStatus, getUserResume, getProfile, updateProfile } from './controller.js';
import auth from '../../middlewares/auth.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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

// ... existing swagger docs ...

router.get('/', auth, authorizeAdmin, getUsers);
router.put('/:id/status', auth, authorizeAdmin, updateUserStatus);
router.get('/:id/resume', auth, authorizeAdmin, getUserResume);

export default router;
