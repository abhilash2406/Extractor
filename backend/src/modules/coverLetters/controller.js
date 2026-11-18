import { goodResponse, failedResponse } from '../../common/response.js';
import { logger } from '../../config/winston-config.js';
import {
  validateCoverLetterInput,
  generateCoverLetterStreamService,
  getCoverLetterCountService,
} from './service.js';

/**
 * POST /api/v1/cover-letters/generate
 * Streams exact progress percentage + live text via Server-Sent Events (SSE).
 */
export const generateCoverLetter = async (req, res) => {
  // Validate upfront so invalid requests return a clean HTTP 400 JSON response
  try {
    validateCoverLetterInput(req.body);
  } catch (err) {
    const status = err.statusCode || 400;
    return res.status(status).json(failedResponse(err.message, status, 'ValidationError'));
  }

  // Configure SSE response headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  let closed = false;
  req.on('close', () => {
    closed = true;
  });

  const emit = (event, payload) => {
    if (closed || res.writableEnded) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
  };

  try {
    await generateCoverLetterStreamService(req.body, req.user || null, emit);
  } catch (err) {
    logger.error(`Cover letter generation error: ${err.message}`);
    emit('error', {
      message: err.message || 'Failed to generate cover letter. Please try again.',
    });
  } finally {
    if (!res.writableEnded) {
      res.end();
    }
  }
};

/**
 * GET /api/v1/cover-letters/stats (Admin)
 * Returns aggregate count of generated cover letters.
 */
export const getCoverLetterStats = async (req, res) => {
  try {
    const data = await getCoverLetterCountService();
    return res.json(goodResponse({ data }, 'Cover letter stats retrieved successfully'));
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json(failedResponse(err.message, status, 'Error'));
  }
};
