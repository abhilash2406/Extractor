import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  generateJobDescription,
} from './controller.js';
import { createJobValidate, updateJobValidate } from './validator.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';

const router = express.Router();

router.post('/generate-description', authorizeAdmin, generateJobDescription);

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: APIs for managing job roles
 */

/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     summary: Create a new job role
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               min_education:
 *                 type: string
 *               min_experience:
 *                 type: integer
 *               skill_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authorizeAdmin, createJobValidate, createJob);

/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     summary: Retrieve all active job roles
 *     tags: [Jobs]
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
 *         description: Search by title or description
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: createdAt }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [ASC, DESC], default: DESC }
 *       - in: query
 *         name: skill_id
 *         schema: { type: string, format: uuid }
 *         description: Filter jobs that require a specific skill (by skill UUID)
 *     responses:
 *       200:
 *         description: A paginated list of jobs
 */
router.get('/', getJobs);


/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Get a job role by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get('/:id', getJobById);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   put:
 *     summary: Update an existing job role
 *     tags: [Jobs]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               min_education:
 *                 type: string
 *               min_experience:
 *                 type: integer
 *               skill_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 */
router.put('/:id', authorizeAdmin, updateJobValidate, updateJob);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   delete:
 *     summary: Soft delete a job role
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
router.delete('/:id', authorizeAdmin, deleteJob);

export default router;
