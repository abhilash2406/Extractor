import express from 'express';
import {
  createSkill,
  getSkills,
  deleteSkill,
} from './controller.js';
import { createSkillValidate } from './validator.js';
import authorizeAdmin from '../../middlewares/authorize-admin.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: APIs for managing job required skills
 */

/**
 * @swagger
 * /api/v1/skills:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skills]
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
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authorizeAdmin, createSkillValidate, createSkill);

/**
 * @swagger
 * /api/v1/skills:
 *   get:
 *     summary: Retrieve all skills
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: A list of skills
 */
router.get('/', getSkills);

/**
 * @swagger
 * /api/v1/skills/{id}:
 *   delete:
 *     summary: Hard delete a skill
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Skill deleted successfully
 *       404:
 *         description: Skill not found
 */
router.delete('/:id', authorizeAdmin, deleteSkill);

export default router;
