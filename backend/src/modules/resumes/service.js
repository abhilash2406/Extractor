import { Op } from 'sequelize';
import Resume from '../../models/resume.js';
import ResumeVersion from '../../models/resumeVersion.js';
import Template from '../../models/template.js';
import Subscription from '../../models/subscription.js';
import Plan from '../../models/plan.js';
import { parsePagination, paginatedResponse } from '../../utils/pagination.js';
import { renderResumeHtml } from '../../utils/htmlTemplate.js';
import { generatePdfFromHtml } from '../../utils/pdfGenerator.js';
import { uploadToB2, getFileBufferFromB2, deleteFromB2 } from '../../utils/backblaze.js';
import { logger } from '../../config/winston-config.js';
import { UserType } from '../../common/enum/usertype-enum.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Ensures each resume has at most 3 versions (on free and paid plans),
 * and renumbers them sequentially as 1, 2, 3 (where 3 is the latest).
 */
export const enforceMaxThreeVersions = async (resumeId) => {
  const versions = await ResumeVersion.findAll({
    where: { resume_id: resumeId },
    order: [['created_at', 'ASC']],
  });

  if (versions.length > 3) {
    const excess = versions.length - 3;
    const toDelete = versions.slice(0, excess);
    await ResumeVersion.destroy({
      where: { id: toDelete.map((v) => v.id) },
    });
    versions.splice(0, excess);
  }

  for (let i = 0; i < versions.length; i++) {
    const targetNumber = i + 1;
    if (versions[i].version_number !== targetNumber) {
      await versions[i].update({ version_number: targetNumber });
    }
  }
};
const isDeepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) {
    return obj1 === obj2;
  }
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2;
  }
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!isDeepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) return false;
    if (!isDeepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
};

/**
 * Resolves template UUID if given a UUID or code slug
 */
const resolveTemplateId = async (templateIdOrCode) => {
  if (!templateIdOrCode) return null;
  if (UUID_REGEX.test(templateIdOrCode)) {
    const tpl = await Template.findByPk(templateIdOrCode);
    return tpl ? tpl.id : null;
  }
  const tpl = await Template.findOne({ where: { code: templateIdOrCode.toLowerCase() } });
  return tpl ? tpl.id : null;
};

/**
 * Resolves a user's plan and max resume limit.
 * Free tier is capped at 3 resumes.
 */
export const getUserPlanAndResumeLimit = async (userId) => {
  const activeSub = await Subscription.findOne({
    where: { user_id: userId, status: 'ACTIVE' },
    include: [{ model: Plan, as: 'plan' }],
    order: [['created_at', 'DESC']],
  });

  const planCode = activeSub?.plan?.code?.toUpperCase() || 'FREE';
  const isPro = planCode === 'PRO' || planCode === 'PREMIUM';
  const resumeLimit = isPro ? (activeSub?.plan?.resume_limit || 999999) : 3;

  return {
    planCode,
    planName: activeSub?.plan?.name || (isPro ? 'Pro' : 'Free'),
    isPro,
    resumeLimit,
  };
};

/**
 * Get resume usage statistics for the user (count, limit, canCreate)
 */
export const getUserResumeUsageService = async (userId) => {
  const { planCode, planName, isPro, resumeLimit } = await getUserPlanAndResumeLimit(userId);
  const count = await Resume.count({ where: { user_id: userId } });

  return {
    count,
    limit: resumeLimit,
    isPro,
    planCode,
    planName,
    canCreate: isPro || count < resumeLimit,
  };
};

/**
 * Create a new resume for logged-in user with free tier limit enforcement (max 3)
 * and automatically records the initial Version 1 snapshot.
 */
export const createResumeService = async (userId, body) => {
  if (!body.content || typeof body.content !== 'object') {
    const error = new Error('Resume content is required and must be an object');
    error.statusCode = 400;
    throw error;
  }

  // Enforce resume limit: max 3 for free users
  const { isPro, resumeLimit } = await getUserPlanAndResumeLimit(userId);
  const currentCount = await Resume.count({ where: { user_id: userId } });
  if (!isPro && currentCount >= resumeLimit) {
    const error = new Error(`You have reached the maximum limit of ${resumeLimit} resumes for the Free plan. Please upgrade to Pro to create more resumes.`);
    error.statusCode = 403;
    error.name = 'LimitReached';
    throw error;
  }

  const templateId = await resolveTemplateId(body.template_id);
  const resumeTitle = (body.title && body.title.trim()) || 'Untitled Resume';

  // Check for duplicate resume name for this user (case-insensitive)
  const existingWithTitle = await Resume.findOne({
    where: {
      user_id: userId,
      title: { [Op.iLike]: resumeTitle },
    },
  });
  if (existingWithTitle) {
    const error = new Error(`You already have a resume named "${resumeTitle}". Please choose a different name.`);
    error.statusCode = 400;
    error.name = 'DuplicateTitle';
    throw error;
  }

  const resume = await Resume.create({
    user_id: userId,
    title: resumeTitle,
    template_id: templateId,
    content: body.content,
    file: body.file || null,
  });

  // Create initial Version 1 snapshot
  try {
    await ResumeVersion.create({
      resume_id: resume.id,
      version_number: 1,
      title: resumeTitle,
      template_id: templateId,
      content: body.content,
      file: body.file || null,
    });
  } catch (err) {
    logger.error(`Failed to create initial version snapshot: ${err.message || err}`);
  }

  return resume;
};

/**
 * Update an existing resume with ownership verification.
 * Automatically saves a new version checkpoint in `resume_versions` when content/template/title changes.
 */
export const updateResumeService = async (userId, resumeId, body) => {
  const resume = await Resume.findByPk(resumeId);
  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  if (resume.user_id !== userId) {
    const error = new Error('Forbidden: You do not own this resume');
    error.statusCode = 403;
    throw error;
  }

  const newTitle = body.title !== undefined ? (body.title.trim() || 'Untitled Resume') : resume.title;
  const newTemplateId = body.template_id !== undefined ? await resolveTemplateId(body.template_id) : resume.template_id;
  const newContent = body.content !== undefined ? body.content : resume.content;

  // If title is changing, verify that no other resume owned by this user has the same name
  if (body.title !== undefined && newTitle.toLowerCase() !== (resume.title || '').trim().toLowerCase()) {
    const duplicateResume = await Resume.findOne({
      where: {
        user_id: userId,
        id: { [Op.ne]: resumeId },
        title: { [Op.iLike]: newTitle },
      },
    });
    if (duplicateResume) {
      const error = new Error(`You already have another resume named "${newTitle}". Please choose a unique name.`);
      error.statusCode = 400;
      error.name = 'DuplicateTitle';
      throw error;
    }
  }

  if (body.content !== undefined && typeof body.content !== 'object') {
    const error = new Error('Content must be an object');
    error.statusCode = 400;
    throw error;
  }

  // Check if content, template, or title changed meaningfully compared to the latest version snapshot
  const latestVersion = await ResumeVersion.findOne({
    where: { resume_id: resumeId },
    order: [['version_number', 'DESC']],
  });

  let shouldCreateVersion = false;
  if (!latestVersion) {
    // Legacy resume with no snapshots: store initial version first
    try {
      await ResumeVersion.create({
        resume_id: resume.id,
        version_number: 1,
        title: resume.title,
        template_id: resume.template_id,
        content: resume.content || {},
        file: resume.file || null,
      });
    } catch (e) {
      logger.warn(`Could not backfill version 1: ${e.message}`);
    }
    shouldCreateVersion = true;
  } else {
    const templateChanged = String(newTemplateId || '') !== String(latestVersion.template_id || '');
    const titleChanged = String(newTitle || '') !== String(latestVersion.title || '');
    const contentChanged = !isDeepEqual(newContent, latestVersion.content);

    if (contentChanged || templateChanged || titleChanged) {
      shouldCreateVersion = true;
    }
  }

  if (shouldCreateVersion) {
    await ResumeVersion.create({
      resume_id: resumeId,
      version_number: 999, // temporary, enforceMaxThreeVersions immediately normalizes to 1, 2, or 3
      title: newTitle,
      template_id: newTemplateId,
      content: newContent,
      file: null, // Outdated; will be regenerated and cached on next download
    });

    // Enforce max 3 version snapshots (numbered 1, 2, 3)
    await enforceMaxThreeVersions(resumeId);
  }

  const updateData = {
    title: newTitle,
    template_id: newTemplateId,
    content: newContent,
  };
  
  // If content/template changed, invalidate the cached PDF reference
  if (shouldCreateVersion) {
    updateData.file = null;
  } else if (body.file !== undefined) {
    updateData.file = body.file;
  }

  await resume.update(updateData);
  return resume;
};

/**
 * Get all versions for a resume
 */
export const getResumeVersionsService = async (userId, resumeId) => {
  const resume = await Resume.findByPk(resumeId);
  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  if (resume.user_id !== userId) {
    const error = new Error('Forbidden: You do not own this resume');
    error.statusCode = 403;
    throw error;
  }

  // Always ensure max 3 versions numbered 1, 2, 3
  await enforceMaxThreeVersions(resumeId);

  const versions = await ResumeVersion.findAll({
    where: { resume_id: resumeId },
    include: [
      {
        model: Template,
        as: 'template',
        attributes: ['id', 'name', 'code', 'category', 'thumbnail_url'],
        required: false,
      },
    ],
    order: [['version_number', 'DESC']],
  });

  return versions;
};

/**
 * Get single version by ID for a resume
 */
export const getResumeVersionByIdService = async (userId, resumeId, versionId) => {
  const resume = await Resume.findByPk(resumeId);
  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  if (resume.user_id !== userId) {
    const error = new Error('Forbidden: You do not own this resume');
    error.statusCode = 403;
    throw error;
  }

  const version = await ResumeVersion.findOne({
    where: { id: versionId, resume_id: resumeId },
    include: [
      {
        model: Template,
        as: 'template',
        attributes: ['id', 'name', 'code', 'category', 'thumbnail_url'],
        required: false,
      },
    ],
  });

  if (!version) {
    const error = new Error('Resume version not found');
    error.statusCode = 404;
    throw error;
  }

  return version;
};

/**
 * Restores a specific version snapshot into the current resume.
 * Copies the version's content, template_id, title into resumes table,
 * and creates a new version checkpoint for the restore event.
 */
export const restoreResumeVersionService = async (userId, resumeId, versionId) => {
  const resume = await Resume.findByPk(resumeId);
  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  if (resume.user_id !== userId) {
    const error = new Error('Forbidden: You do not own this resume');
    error.statusCode = 403;
    throw error;
  }

  const targetVersion = await ResumeVersion.findOne({
    where: { id: versionId, resume_id: resumeId },
    include: [{ model: Template, as: 'template', required: false }],
  });

  if (!targetVersion) {
    const error = new Error('Resume version to restore not found');
    error.statusCode = 404;
    throw error;
  }

  // 1. Copy snapshot content, template, and title to current resume
  resume.content = targetVersion.content;
  resume.template_id = targetVersion.template_id;
  if (targetVersion.title && targetVersion.title.trim().toLowerCase() !== (resume.title || '').trim().toLowerCase()) {
    const duplicate = await Resume.findOne({
      where: {
        user_id: userId,
        id: { [Op.ne]: resumeId },
        title: { [Op.iLike]: targetVersion.title.trim() },
      },
    });
    if (!duplicate) {
      resume.title = targetVersion.title;
    }
  }
  if (targetVersion.file) resume.file = targetVersion.file;
  await resume.save();

  // 2. Record this restore action as a new checkpoint in version history
  const restoredVersionSnapshot = await ResumeVersion.create({
    resume_id: resume.id,
    version_number: 999,
    title: resume.title,
    template_id: resume.template_id,
    content: resume.content,
    file: resume.file || null,
  });

  // Enforce max 3 version snapshots (1, 2, 3)
  await enforceMaxThreeVersions(resume.id);

  const fullResume = await Resume.findByPk(resume.id, {
    include: [{ model: Template, as: 'template', required: false }],
  });

  return {
    resume: fullResume,
    restoredVersion: restoredVersionSnapshot,
    sourceVersionNumber: targetVersion.version_number,
  };
};

/**
 * Get the latest (last edited) resume for the logged-in user.
 * Used when user enters the resume builder to immediately show their most recent work.
 */
export const getLatestResumeService = async (userId) => {
  const latestResume = await Resume.findOne({
    where: { user_id: userId },
    order: [['updated_at', 'DESC']],
    include: [
      {
        model: Template,
        as: 'template',
        required: false,
      },
    ],
  });

  return latestResume;
};

/**
 * Get all resumes for the logged-in user
 */
export const getMyResumesService = async (userId, query = {}) => {
  const { page, limit, offset, sortBy, sortOrder } = parsePagination(query, 'updated_at');

  const { rows, count } = await Resume.findAndCountAll({
    where: { user_id: userId },
    limit,
    offset,
    order: [[sortBy || 'updated_at', sortOrder || 'DESC']],
    include: [
      {
        model: Template,
        as: 'template',
        attributes: ['id', 'name', 'code', 'category', 'thumbnail_url', 'status'],
        required: false,
      },
    ],
  });

  return paginatedResponse(rows, count, page, limit);
};

/**
 * Get single resume by ID with ownership verification
 */
export const getResumeByIdService = async (userId, resumeId, userRole = null) => {
  const resume = await Resume.findByPk(resumeId, {
    include: [
      {
        model: Template,
        as: 'template',
        required: false,
      },
      {
        model: ResumeVersion,
        as: 'versions',
        attributes: ['id', 'version_number', 'title', 'created_at', 'template_id'],
        required: false,
      },
    ],
    order: [[{ model: ResumeVersion, as: 'versions' }, 'version_number', 'DESC']],
  });

  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  if (resume.user_id !== userId && userRole !== UserType.ADMIN) {
    const error = new Error('Forbidden: You do not have access to this resume');
    error.statusCode = 403;
    throw error;
  }

  return resume;
};

/**
 * Delete a resume with ownership verification
 */
export const deleteResumeService = async (userId, resumeId) => {
  const resume = await Resume.findByPk(resumeId);
  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  if (resume.user_id !== userId) {
    const error = new Error('Forbidden: You cannot delete this resume');
    error.statusCode = 403;
    throw error;
  }

  // Clean up persistent PDF files from Backblaze B2
  try {
    if (resume.file) {
      await deleteFromB2(resume.file).catch(() => {});
    }
    const versions = await ResumeVersion.findAll({ where: { resume_id: resumeId } });
    for (const v of versions) {
      if (v.file && v.file !== resume.file) {
        await deleteFromB2(v.file).catch(() => {});
      }
    }
  } catch (err) {
    logger.warn(`Could not clean up B2 files on delete: ${err.message}`);
  }

  await resume.destroy();
  return true;
};

/**
 * Generate PDF binary for download
 * Supports guests (content in body) or authenticated users (content in body or resumeId)
 */
export const generateResumePdfService = async (body, currentUser = null) => {
  let content = body.content;
  let title = body.title || 'Resume';
  let templateConfig = null;
  let savedResume = null;

  // 1. If resumeId is supplied, verify ownership and load saved content
  if (body.resumeId) {
    if (!currentUser) {
      const error = new Error('Authentication required to download a saved resume by ID');
      error.statusCode = 401;
      throw error;
    }
    savedResume = await Resume.findByPk(body.resumeId, {
      include: [{ model: Template, as: 'template', required: false }],
    });
    if (!savedResume) {
      const error = new Error('Resume not found');
      error.statusCode = 404;
      throw error;
    }
    if (savedResume.user_id !== currentUser.id && currentUser.role !== UserType.ADMIN) {
      const error = new Error('Forbidden: You do not have access to this resume');
      error.statusCode = 403;
      throw error;
    }

    const safeFilename = `${(savedResume.title || title).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

    // 2. CHECK PERSISTENT B2 STORAGE:
    // If a cached PDF file exists on the resume and no unsaved overriding content was passed
    const hasUnsavedContent = body.content && !isDeepEqual(body.content, savedResume.content);
    const hasUnsavedDesign = body.designConfig && !isDeepEqual(body.designConfig, savedResume.content?.design_config);

    if (savedResume.file && !hasUnsavedContent && !hasUnsavedDesign) {
      try {
        logger.info(`[Persistent PDF] Checking Backblaze B2 for cached PDF key: ${savedResume.file}`);
        const cachedPdfBuffer = await getFileBufferFromB2(savedResume.file);
        if (cachedPdfBuffer && cachedPdfBuffer.length > 0) {
          logger.info(`[Persistent PDF HIT] Retrieved cached PDF directly from B2: ${savedResume.file} (${cachedPdfBuffer.length} bytes)`);
          return {
            buffer: cachedPdfBuffer,
            filename: safeFilename,
            fromCache: true,
          };
        }
      } catch (b2Err) {
        logger.warn(`[Persistent PDF MISS] Could not retrieve cached PDF (${savedResume.file}) from B2: ${b2Err.message}`);
        // Fallback: Proceed to generate fresh PDF with Puppeteer
      }
    }

    content = savedResume.content;
    title = savedResume.title || title;
    if (savedResume.template) {
      templateConfig = {
        layout_config: savedResume.template.layout_config,
        design_config: savedResume.template.design_config,
      };
    }
  }

  if (!content || typeof content !== 'object') {
    const error = new Error('Resume content is required');
    error.statusCode = 400;
    throw error;
  }

  // 3. Resolve template configuration
  if (!templateConfig && body.template_id) {
    const tpl = UUID_REGEX.test(body.template_id)
      ? await Template.findByPk(body.template_id)
      : await Template.findOne({ where: { code: body.template_id.toLowerCase() } });
    if (tpl) {
      templateConfig = {
        layout_config: tpl.layout_config,
        design_config: tpl.design_config,
      };
    }
  }

  // Merge custom accentColor, designConfig, or design_config if passed
  if (!templateConfig) {
    templateConfig = { design_config: {} };
  }
  const customDesign = body.design_config || body.designConfig || {};
  templateConfig.design_config = {
    ...(templateConfig.design_config || {}),
    ...customDesign,
    ...(body.accentColor ? { primaryColor: body.accentColor, accentColor: body.accentColor } : {}),
  };

  // 4. Render trusted HTML
  const html = renderResumeHtml(content, templateConfig, title);

  // 5. Generate fresh PDF binary using Puppeteer
  const pdfBuffer = await generatePdfFromHtml(html);

  // Clean filename for attachment
  const safeFilename = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

  // 6. PERSIST TO BACKBLAZE B2:
  // Store the newly generated PDF in B2 and save its reference in PostgreSQL
  if (savedResume) {
    try {
      const latestVer = await ResumeVersion.findOne({
        where: { resume_id: savedResume.id },
        order: [['version_number', 'DESC']],
      });
      const versionTag = latestVer ? `v${latestVer.version_number}` : 'v1';
      const b2Key = `resumes/${savedResume.user_id}/${savedResume.id}/${versionTag}.pdf`;

      await uploadToB2(safeFilename, pdfBuffer, 'application/pdf', b2Key);
      await savedResume.update({ file: b2Key });
      if (latestVer) {
        await latestVer.update({ file: b2Key });
      }
      logger.info(`[Persistent PDF SAVED] Persisted generated PDF for resume ${savedResume.id} to B2: ${b2Key}`);
    } catch (uploadErr) {
      logger.error(`[Persistent PDF ERROR] Failed to cache PDF in B2: ${uploadErr.message || uploadErr}`);
      // Non-blocking: return the buffer anyway so user gets their download
    }
  }

  return {
    buffer: pdfBuffer,
    filename: safeFilename,
    fromCache: false,
  };
};
