import express from 'express';
import {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from './controller.js';
import auth from '../../middlewares/auth.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';
import optionalAuth from '../../middlewares/optional-auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: User feedback submissions and admin inquiry management
 */

/**
 * @swagger
 * /api/v1/feedback:
 *   post:
 *     tags: [Feedback]
 *     summary: Submit user feedback
 *     description: Allows guests or authenticated users to submit feedback, bug reports, or feature requests.
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 */
router.post('/', optionalAuth, createFeedback);

/**
 * @swagger
 * /api/v1/feedback:
 *   get:
 *     tags: [Feedback]
 *     summary: List all feedback inquiries (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated list of feedback entries
 */
router.get('/', auth, authorizeAdmin, getFeedbacks);

/**
 * @swagger
 * /api/v1/feedback/{id}:
 *   get:
 *     tags: [Feedback]
 *     summary: Get feedback detail by ID (Admin)
 */
router.get('/:id', auth, authorizeAdmin, getFeedbackById);

/**
 * @swagger
 * /api/v1/feedback/{id}:
 *   patch:
 *     tags: [Feedback]
 *     summary: Update feedback status (ENUM) and/or internal admin notes (Admin)
 */
router.patch('/:id', auth, authorizeAdmin, updateFeedback);

/**
 * @swagger
 * /api/v1/feedback/{id}:
 *   delete:
 *     tags: [Feedback]
 *     summary: Delete a feedback entry (Admin)
 */
router.delete('/:id', auth, authorizeAdmin, deleteFeedback);

export default router;
