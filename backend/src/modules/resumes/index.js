import express from 'express';
import {
  createResume,
  updateResume,
  getMyResumes,
  getLatestResume,
  getUserResumeUsage,
  getResumeById,
  deleteResume,
  downloadResumePdf,
  getResumeVersions,
  getResumeVersionById,
  restoreResumeVersion,
} from './controller.js';
import auth from '../../middlewares/auth.js';
import optionalAuth from '../../middlewares/optional-auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: Candidate resume creation, storage, versioning, and PDF generation APIs
 */

/**
 * @swagger
 * /api/v1/resumes:
 *   post:
 *     tags: [Resumes]
 *     summary: Save new resume for logged-in candidate (Free tier max 3 resumes)
 */
router.post('/', auth, createResume);

/**
 * @swagger
 * /api/v1/resumes/my:
 *   get:
 *     tags: [Resumes]
 *     summary: List all saved resumes for the current logged-in user
 */
router.get('/my', auth, getMyResumes);

/**
 * @swagger
 * /api/v1/resumes/latest:
 *   get:
 *     tags: [Resumes]
 *     summary: Get the latest (last edited) resume for the current user to resume editing
 */
router.get('/latest', auth, getLatestResume);

/**
 * @swagger
 * /api/v1/resumes/usage:
 *   get:
 *     tags: [Resumes]
 *     summary: Get current resume usage and limit info for the user
 */
router.get('/usage', auth, getUserResumeUsage);

/**
 * @swagger
 * /api/v1/resumes/download-pdf:
 *   post:
 *     tags: [Resumes]
 *     summary: Generate and stream high-quality A4 resume PDF (Guests or logged-in users)
 */
router.post('/download-pdf', optionalAuth, downloadResumePdf);

/**
 * @swagger
 * /api/v1/resumes/{id}:
 *   get:
 *     tags: [Resumes]
 *     summary: Get single saved resume by ID
 */
router.get('/:id', auth, getResumeById);

/**
 * @swagger
 * /api/v1/resumes/{id}:
 *   put:
 *     tags: [Resumes]
 *     summary: Update an existing saved resume and create a version snapshot
 */
router.put('/:id', auth, updateResume);

/**
 * @swagger
 * /api/v1/resumes/{id}:
 *   delete:
 *     tags: [Resumes]
 *     summary: Delete a saved resume
 */
router.delete('/:id', auth, deleteResume);

/**
 * @swagger
 * /api/v1/resumes/{id}/versions:
 *   get:
 *     tags: [Resumes]
 *     summary: Get all version snapshots for a resume
 */
router.get('/:id/versions', auth, getResumeVersions);

/**
 * @swagger
 * /api/v1/resumes/{id}/versions/{versionId}:
 *   get:
 *     tags: [Resumes]
 *     summary: Get a specific version snapshot
 */
router.get('/:id/versions/:versionId', auth, getResumeVersionById);

/**
 * @swagger
 * /api/v1/resumes/{id}/versions/{versionId}/restore:
 *   post:
 *     tags: [Resumes]
 *     summary: Restore a previous version snapshot into the current resume
 */
router.post('/:id/versions/:versionId/restore', auth, restoreResumeVersion);

export default router;
