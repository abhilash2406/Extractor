import express from 'express';
import {
  createResume,
  updateResume,
  getMyResumes,
  getResumeById,
  deleteResume,
  downloadResumePdf,
} from './controller.js';
import auth from '../../middlewares/auth.js';
import optionalAuth from '../../middlewares/optional-auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: Candidate resume creation, storage, and PDF generation APIs
 */

/**
 * @swagger
 * /api/v1/resumes:
 *   post:
 *     tags: [Resumes]
 *     summary: Save new resume for logged-in candidate
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               template_id:
 *                 type: string
 *               content:
 *                 type: object
 *     responses:
 *       201:
 *         description: Resume saved successfully
 */
router.post('/', auth, createResume);

/**
 * @swagger
 * /api/v1/resumes/my:
 *   get:
 *     tags: [Resumes]
 *     summary: List all saved resumes for the current logged-in user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of resumes
 */
router.get('/my', auth, getMyResumes);

/**
 * @swagger
 * /api/v1/resumes/download-pdf:
 *   post:
 *     tags: [Resumes]
 *     summary: Generate and stream high-quality A4 resume PDF (Guests or logged-in users)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeId:
 *                 type: string
 *                 description: Optional ID of saved resume (requires auth)
 *               title:
 *                 type: string
 *               template_id:
 *                 type: string
 *               accentColor:
 *                 type: string
 *               content:
 *                 type: object
 *     responses:
 *       200:
 *         description: Binary PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.post('/download-pdf', optionalAuth, downloadResumePdf);

/**
 * @swagger
 * /api/v1/resumes/{id}:
 *   get:
 *     tags: [Resumes]
 *     summary: Get single saved resume by ID
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
 *         description: Resume details
 *       403:
 *         description: Forbidden (not owner)
 *       404:
 *         description: Resume not found
 */
router.get('/:id', auth, getResumeById);

/**
 * @swagger
 * /api/v1/resumes/{id}:
 *   put:
 *     tags: [Resumes]
 *     summary: Update an existing saved resume
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
 *               title:
 *                 type: string
 *               template_id:
 *                 type: string
 *               content:
 *                 type: object
 *     responses:
 *       200:
 *         description: Resume updated successfully
 */
router.put('/:id', auth, updateResume);

/**
 * @swagger
 * /api/v1/resumes/{id}:
 *   delete:
 *     tags: [Resumes]
 *     summary: Delete a saved resume
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
 *         description: Resume deleted successfully
 */
router.delete('/:id', auth, deleteResume);

export default router;
