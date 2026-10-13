import express from 'express';
import multer from 'multer';
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  updateTemplateStatus,
  duplicateTemplate,
  deleteTemplate,
  uploadThumbnail,
} from './controller.js';
import auth from '../../middlewares/auth.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';
import optionalAuth from '../../middlewares/optional-auth.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: Resume template layout and design management APIs
 */

/**
 * @swagger
 * /api/v1/templates:
 *   get:
 *     tags: [Templates]
 *     summary: List resume templates
 *     description: Retrieve templates with pagination and filtering. Regular users only receive published templates; admins can view drafts and archived templates.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, code, or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g. Modern, Executive, Creative, etc.)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, published, draft, archived]
 *         description: Filter by publication status (Admin only)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *     responses:
 *       200:
 *         description: Paginated list of resume templates
 */
router.get('/', optionalAuth, getTemplates);

/**
 * @swagger
 * /api/v1/templates/{idOrCode}:
 *   get:
 *     tags: [Templates]
 *     summary: Get single template by ID or code
 *     parameters:
 *       - in: path
 *         name: idOrCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Template UUID or unique code slug
 *     responses:
 *       200:
 *         description: Template details including full layout_config and design_config
 *       404:
 *         description: Template not found
 */
router.get('/:idOrCode', optionalAuth, getTemplate);

/**
 * @swagger
 * /api/v1/templates:
 *   post:
 *     tags: [Templates]
 *     summary: Create new resume template (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Modern Executive
 *               code:
 *                 type: string
 *                 example: modern-executive-pro
 *               category:
 *                 type: string
 *                 example: Executive
 *               description:
 *                 type: string
 *               thumbnail_url:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived, deleted]
 *                 default: draft
 *               layout_config:
 *                 type: object
 *               design_config:
 *                 type: object
 *     responses:
 *       201:
 *         description: Template created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 */
router.post('/', auth, authorizeAdmin, upload.single('thumbnail'), createTemplate);

/**
 * @swagger
 * /api/v1/templates/{id}:
 *   put:
 *     tags: [Templates]
 *     summary: Update an existing template (Admin only)
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
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail_url:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived, deleted]
 *               layout_config:
 *                 type: object
 *               design_config:
 *                 type: object
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       404:
 *         description: Template not found
 */
router.put('/:id', auth, authorizeAdmin, upload.single('thumbnail'), updateTemplate);

/**
 * @swagger
 * /api/v1/templates/{id}/status:
 *   patch:
 *     tags: [Templates]
 *     summary: Update template publication status (Admin only)
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived, deleted]
 *     responses:
 *       200:
 *         description: Template status updated successfully
 */
router.patch('/:id/status', auth, authorizeAdmin, updateTemplateStatus);

/**
 * @swagger
 * /api/v1/templates/{id}/duplicate:
 *   post:
 *     tags: [Templates]
 *     summary: Duplicate template as draft (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Duplicated template created successfully
 */
router.post('/:id/duplicate', auth, authorizeAdmin, duplicateTemplate);

/**
 * @swagger
 * /api/v1/templates/{id}:
 *   delete:
 *     tags: [Templates]
 *     summary: Delete a template (Admin only)
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
 *         description: Template deleted successfully
 *       404:
 *         description: Template not found
 */
router.delete('/:id', auth, authorizeAdmin, deleteTemplate);

/**
 * @swagger
 * /api/v1/templates/{id}/thumbnail:
 *   post:
 *     tags: [Templates]
 *     summary: Upload thumbnail preview image for template (Admin only)
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thumbnail uploaded successfully
 */
router.post('/:id/thumbnail', auth, authorizeAdmin, upload.single('thumbnail'), uploadThumbnail);

export default router;
