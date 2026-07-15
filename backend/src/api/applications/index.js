import express from 'express';
import multer from 'multer';
import { getApplications, getApplication, uploadResume, createApplication, getMyApplications, getCurrentResume, updateApplicationStatus } from './controller.js';
import auth from '../../middlewares/auth.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: APIs for managing job applications
 */

/**
 * @swagger
 * /api/v1/applications/me:
 *   get:
 *     summary: Get logged in candidate's applications
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: List of candidate's applications
 */
router.get('/me', auth, getMyApplications);

/**
 * @swagger
 * /api/v1/applications/resume:
 *   get:
 *     summary: Get current candidate's active resume
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: Returns candidate's resume presigned URL if exists
 */
router.get('/resume', auth, getCurrentResume);

/**
 * @swagger
 * /api/v1/applications:
 *   get:
 *     summary: List all applications with filters (Admin only)
 *     tags: [Applications]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by applicant name or email
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: updated_at }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [ASC, DESC], default: DESC }
 *       - in: query
 *         name: job_role_id
 *         schema: { type: string, format: uuid }
 *         description: Filter by a specific job role
 *       - in: query
 *         name: skill
 *         schema: { type: string }
 *         description: Filter by a matched skill name
 *     responses:
 *       200:
 *         description: Paginated list of applications
 *       403:
 *         description: Forbidden
 */
router.get('/', auth, authorizeAdmin, getApplications);

/**
 * @swagger
 * /api/v1/applications/{id}:
 *   get:
 *     summary: Get a specific application by ID (Admin only)
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Application details
 *       403:
 *         description: Forbidden
 */
router.get('/:id', auth, authorizeAdmin, getApplication);

/**
 * @swagger
 * /api/v1/applications/resume:
 *   post:
 *     summary: Upload a resume (PDF/DOCX) for application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 */
router.post('/resume', auth, upload.single('file'), uploadResume);

/**
 * @swagger
 * /api/v1/applications:
 *   post:
 *     summary: Submit a job application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_role_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Application submitted successfully
 */
router.post('/', auth, createApplication);

/**
 * @swagger
 * /api/v1/applications/{id}/status:
 *   put:
 *     summary: Update application status (Admin only)
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application status updated successfully
 */
router.put('/:id/status', auth, authorizeAdmin, updateApplicationStatus);

export default router;
