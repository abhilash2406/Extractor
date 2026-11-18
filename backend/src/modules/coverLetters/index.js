import express from 'express';
import { generateCoverLetter, getCoverLetterStats } from './controller.js';
import auth from '../../middlewares/auth.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';
import optionalAuth from '../../middlewares/optional-auth.js';
import { failedResponse } from '../../common/response.js';

const router = express.Router();

// Lightweight in-memory per-IP rate limiter (20 requests per 15 min window)
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_REQUESTS = 20;
const ipHits = new Map();

const coverLetterRateLimit = (req, res, next) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    'unknown';
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return next();
  }

  if (entry.count >= RATE_MAX_REQUESTS) {
    const retryMinutes = Math.max(1, Math.ceil((entry.resetAt - now) / 60000));
    return res
      .status(429)
      .json(
        failedResponse(
          `Rate limit reached. Please try again in ${retryMinutes} minute${retryMinutes > 1 ? 's' : ''}.`,
          429,
          'TooManyRequests'
        )
      );
  }

  entry.count += 1;
  return next();
};

/**
 * @swagger
 * tags:
 *   name: Cover Letters
 *   description: Free stateless AI cover letter generation with real-time SSE progress
 */

/**
 * @swagger
 * /api/v1/cover-letters/generate:
 *   post:
 *     tags: [Cover Letters]
 *     summary: Generate a tailored cover letter via SSE streaming
 *     description: Free for guests and signed-in users. Streams real-time progress percentage (0-100%) and text chunks without storing content.
 *     responses:
 *       200:
 *         description: text/event-stream containing progress, chunk, and done events
 */
router.post('/generate', coverLetterRateLimit, optionalAuth, generateCoverLetter);

/**
 * @swagger
 * /api/v1/cover-letters/stats:
 *   get:
 *     tags: [Cover Letters]
 *     summary: Get aggregate cover letter generation count (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total number of cover letters generated
 */
router.get('/stats', auth, authorizeAdmin, getCoverLetterStats);

export default router;
