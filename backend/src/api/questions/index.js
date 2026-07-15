import express from 'express';
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  generateQuestion,
} from './controller.js';
import { createQuestionValidate, updateQuestionValidate } from './validator.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';

const router = express.Router();

router.post('/generate', authorizeAdmin, generateQuestion);

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: APIs for managing test questions
 */

/**
 * @swagger
 * /api/v1/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - option_a
 *               - option_b
 *               - option_c
 *               - option_d
 *               - correct_answer
 *             properties:
 *               question:
 *                 type: string
 *               option_a:
 *                 type: string
 *               option_b:
 *                 type: string
 *               option_c:
 *                 type: string
 *               option_d:
 *                 type: string
 *               correct_answer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authorizeAdmin, createQuestionValidate, createQuestion);

/**
 * @swagger
 * /api/v1/questions:
 *   get:
 *     summary: Retrieve all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: A list of questions
 */
router.get('/', getQuestions);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Question not found
 */
router.get('/:id', getQuestionById);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   put:
 *     summary: Update an existing question
 *     tags: [Questions]
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
 *               question:
 *                 type: string
 *               option_a:
 *                 type: string
 *               option_b:
 *                 type: string
 *               option_c:
 *                 type: string
 *               option_d:
 *                 type: string
 *               correct_answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       404:
 *         description: Question not found
 */
router.put('/:id', authorizeAdmin, updateQuestionValidate, updateQuestion);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   delete:
 *     summary: Hard delete a question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 */
router.delete('/:id', authorizeAdmin, deleteQuestion);

export default router;
