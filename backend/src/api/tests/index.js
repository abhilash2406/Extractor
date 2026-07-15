import express from 'express';
import { getMyTests, getTestById, submitTestAnswers, getAdminTestById } from './controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: APIs for managing candidate assessment tests
 */

/**
 * @swagger
 * /api/v1/tests/me:
 *   get:
 *     summary: Get all tests assigned to the logged-in candidate
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: List of candidate's tests
 */
router.get('/me', getMyTests);

/**
 * @swagger
 * /api/v1/tests/admin/{id}:
 *   get:
 *     summary: Get full test details (for admins)
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: Test details with answers and correctness
 */
router.get('/admin/:id', getAdminTestById);

/**
 * @swagger
 * /api/v1/tests/{id}:
 *   get:
 *     summary: Get details of a specific test including questions
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Test details and questions (answers excluded if not completed)
 */
router.get('/:id', getTestById);

/**
 * @swagger
 * /api/v1/tests/{id}/submit:
 *   put:
 *     summary: Submit answers for a specific test
 *     tags: [Tests]
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
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     answerId:
 *                       type: string
 *                       format: uuid
 *                     selectedAnswer:
 *                       type: string
 *     responses:
 *       200:
 *         description: Test submitted successfully and score computed
 */
router.put('/:id/submit', submitTestAnswers);

export default router;
