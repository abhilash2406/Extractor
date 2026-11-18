import { Op } from 'sequelize';
import Feedback from '../../models/feedback.js';
import User from '../../models/user.js';
import { FeedbackStatus, FeedbackCategory } from '../../common/enum/feedback-enum.js';
import { parsePagination, paginatedResponse } from '../../utils/pagination.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_STATUSES = Object.values(FeedbackStatus);
const VALID_CATEGORIES = Object.values(FeedbackCategory);

/**
 * Submit new user feedback (Public or authenticated user)
 */
export const createFeedbackService = async (body = {}, currentUser = null) => {
  const name = (body.name || currentUser?.username || '').trim();
  const email = (body.email || currentUser?.email || '').trim().toLowerCase();
  const subject = (body.subject || '').trim();
  const message = (body.message || '').trim();
  const rawCategory = (body.category || FeedbackCategory.GENERAL).trim().toLowerCase();
  const rating =
    body.rating !== undefined && body.rating !== null && body.rating !== ''
      ? parseInt(body.rating, 10)
      : null;

  if (!name || name.length < 2) {
    const err = new Error('Please provide your name (at least 2 characters).');
    err.statusCode = 400;
    throw err;
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    const err = new Error('Please provide a valid email address.');
    err.statusCode = 400;
    throw err;
  }

  if (!subject || subject.length < 3) {
    const err = new Error('Please provide a short subject (at least 3 characters).');
    err.statusCode = 400;
    throw err;
  }

  if (!message || message.length < 10) {
    const err = new Error('Please enter a message of at least 10 characters.');
    err.statusCode = 400;
    throw err;
  }

  if (!VALID_CATEGORIES.includes(rawCategory)) {
    const err = new Error(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  if (rating !== null && (isNaN(rating) || rating < 1 || rating > 5)) {
    const err = new Error('Rating must be an integer between 1 and 5.');
    err.statusCode = 400;
    throw err;
  }

  const feedback = await Feedback.create({
    user_id: currentUser?.id || null,
    name: name.slice(0, 255),
    email: email.slice(0, 255),
    category: rawCategory,
    subject: subject.slice(0, 255),
    message,
    rating,
    status: FeedbackStatus.NEW,
  });

  return feedback;
};

/**
 * List feedbacks with search, category, status filter & pagination (Admin)
 */
export const getFeedbacksService = async (query = {}) => {
  const { page, limit, offset, sortOrder, search } = parsePagination(query, 'created_at');
  const where = {};

  if (query.category && query.category.toUpperCase() !== 'ALL') {
    const cat = query.category.toLowerCase();
    if (VALID_CATEGORIES.includes(cat)) {
      where.category = cat;
    }
  }

  if (query.status && query.status.toUpperCase() !== 'ALL') {
    const st = query.status.toUpperCase();
    if (VALID_STATUSES.includes(st)) {
      where.status = st;
    }
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { subject: { [Op.iLike]: `%${search}%` } },
      { message: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const [{ rows, count }, totalCount, newCount, inReviewCount, resolvedCount, closedCount] =
    await Promise.all([
      Feedback.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', sortOrder]],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'profile_pic'],
            required: false,
          },
        ],
      }),
      Feedback.count(),
      Feedback.count({ where: { status: FeedbackStatus.NEW } }),
      Feedback.count({ where: { status: FeedbackStatus.IN_REVIEW } }),
      Feedback.count({ where: { status: FeedbackStatus.RESOLVED } }),
      Feedback.count({ where: { status: FeedbackStatus.CLOSED } }),
    ]);

  const result = paginatedResponse(rows, count, page, limit);
  result.stats = {
    total: totalCount,
    new: newCount,
    inReview: inReviewCount,
    resolved: resolvedCount,
    closed: closedCount,
  };

  return result;
};

/**
 * Get a single feedback entry by UUID (Admin)
 */
export const getFeedbackByIdService = async (id) => {
  if (!UUID_REGEX.test(id)) {
    const err = new Error('Invalid feedback ID');
    err.statusCode = 400;
    throw err;
  }

  const feedback = await Feedback.findByPk(id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'profile_pic'],
        required: false,
      },
    ],
  });

  if (!feedback) {
    const err = new Error('Feedback entry not found');
    err.statusCode = 404;
    throw err;
  }

  return feedback;
};

/**
 * Update feedback status (ENUM) and/or internal admin notes (Admin)
 */
export const updateFeedbackService = async (id, body = {}) => {
  if (!UUID_REGEX.test(id)) {
    const err = new Error('Invalid feedback ID');
    err.statusCode = 400;
    throw err;
  }

  const feedback = await Feedback.findByPk(id);
  if (!feedback) {
    const err = new Error('Feedback entry not found');
    err.statusCode = 404;
    throw err;
  }

  const updates = {};

  if (body.status !== undefined) {
    const normalizedStatus = String(body.status).toUpperCase();
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      const err = new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }
    updates.status = normalizedStatus;
  }

  if (body.admin_notes !== undefined) {
    updates.admin_notes = body.admin_notes === null ? null : String(body.admin_notes).trim();
  }

  if (Object.keys(updates).length === 0) {
    const err = new Error('No valid fields provided to update.');
    err.statusCode = 400;
    throw err;
  }

  await feedback.update(updates);
  return feedback;
};

/**
 * Permanently delete a feedback entry (Admin)
 */
export const deleteFeedbackService = async (id) => {
  if (!UUID_REGEX.test(id)) {
    const err = new Error('Invalid feedback ID');
    err.statusCode = 400;
    throw err;
  }

  const feedback = await Feedback.findByPk(id);
  if (!feedback) {
    const err = new Error('Feedback entry not found');
    err.statusCode = 404;
    throw err;
  }

  await feedback.destroy();
  return true;
};
