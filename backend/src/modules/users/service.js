import '../../models/index.js';
import User from '../../models/user.js';
import Resume from '../../models/resume.js';
import ResumeAnalysis from '../../models/resumeAnalysis.js';
import Subscription from '../../models/subscription.js';
import Plan from '../../models/plan.js';
import sequelize from '../../config/sequelize-config.js';
import { Op } from 'sequelize';
import { parsePagination, paginatedResponse } from '../../utils/pagination.js';
import { UserType } from '../../common/enum/usertype-enum.js';
import { EntityType } from '../../common/enum/activity-enum.js';

export const getUsersService = async (query) => {
  const { page, limit, offset, sortBy, sortOrder, search } = parsePagination(query, 'created_at');

  const where = {
    role: { [Op.ne]: UserType.ADMIN },
    status: { [Op.ne]: EntityType.DELETED }
  };

  // 1. Search (Name, email)
  if (search) {
    where[Op.or] = [
      { username: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // 2. Status filter (Active, Blocked)
  if (query.status && query.status !== 'ALL') {
    const statusUpper = query.status.toUpperCase();
    if (Object.values(EntityType).includes(statusUpper)) {
      where.status = statusUpper;
    }
  }

  // 3. Plan filter (Free, Basic, Pro, Premium)
  if (query.plan && query.plan !== 'ALL') {
    const planUpper = query.plan.toUpperCase();
    const andClauses = where[Op.and] ? [...where[Op.and]] : [];
    if (planUpper === 'FREE') {
      andClauses.push(
        sequelize.literal(`(
          NOT EXISTS (
            SELECT 1 FROM "subscriptions" AS s
            JOIN "plans" AS p ON s.plan_id = p.id
            WHERE s.user_id = "User"."id" AND p.code != 'FREE' AND s.status = 'ACTIVE'
          )
        )`)
      );
    } else {
      andClauses.push(
        sequelize.literal(`(
          EXISTS (
            SELECT 1 FROM "subscriptions" AS s
            JOIN "plans" AS p ON s.plan_id = p.id
            WHERE s.user_id = "User"."id" AND UPPER(p.code) = '${planUpper.replace(/'/g, "''")}' AND s.status = 'ACTIVE'
          )
        )`)
      );
    }
    where[Op.and] = andClauses;
  }

  // 4. Joined Date filter (startDate, endDate)
  if (query.startDate || query.endDate) {
    const dateFilter = {};
    if (query.startDate) {
      const start = new Date(query.startDate);
      start.setHours(0, 0, 0, 0);
      dateFilter[Op.gte] = start;
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter[Op.lte] = end;
    }
    where.created_at = dateFilter;
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: [
      'id',
      'username',
      'email',
      'status',
      'created_at',
      'last_login_at',
      'profile_pic',
      [sequelize.literal('(SELECT COUNT(*) FROM "resumes" WHERE "resumes"."user_id" = "User"."id")'), 'resume_count']
    ],
    include: [
      {
        model: Subscription,
        as: 'subscriptions',
        include: [{ model: Plan, as: 'plan' }],
        limit: 1,
        order: [['created_at', 'DESC']],
        required: false,
      }
    ],
    order: [[sortBy, sortOrder]],
    limit,
    offset,
  });

  const formattedRows = rows.map((u) => {
    const json = u.toJSON();
    const activeSub = json.subscriptions && json.subscriptions.length > 0 ? json.subscriptions[0] : null;
    const planName = activeSub?.plan?.name || 'Free';
    const planCode = activeSub?.plan?.code || 'FREE';
    return {
      ...json,
      plan: planName,
      plan_code: planCode,
      resumes_count: parseInt(json.resume_count || 0, 10),
    };
  });

  return paginatedResponse(formattedRows, count, page, limit);
};

export const getUserService = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { 
      exclude: ['password'],
      include: [
        [sequelize.literal('(SELECT COUNT(*) FROM "resumes" WHERE "resumes"."user_id" = "User"."id")'), 'resume_count'],
        [sequelize.literal('(SELECT COUNT(*) FROM "resume_analyses" JOIN "resumes" ON "resume_analyses"."resume_id" = "resumes"."id" WHERE "resumes"."user_id" = "User"."id")'), 'ai_analyses_count'],
      ]
    },
    include: [
      {
        model: Subscription,
        as: 'subscriptions',
        include: [{ model: Plan, as: 'plan' }],
        limit: 1,
        order: [['created_at', 'DESC']],
        required: false,
      },
      {
        model: Resume,
        as: 'resumes',
        include: [{ model: ResumeAnalysis, as: 'analysis' }],
        limit: 1,
        order: [['uploaded_at', 'DESC']],
        required: false,
      }
    ]
  });
  if (!user) throw new Error('User not found');
  const json = user.toJSON();
  const activeSub = json.subscriptions && json.subscriptions.length > 0 ? json.subscriptions[0] : null;
  const latestResume = json.resumes && json.resumes.length > 0 ? json.resumes[0] : null;

  return {
    ...json,
    plan: activeSub?.plan?.name || 'Free',
    plan_code: activeSub?.plan?.code || 'FREE',
    subscription: activeSub ? {
      id: activeSub.id,
      status: activeSub.status,
      starts_at: activeSub.starts_at,
      current_period_start: activeSub.current_period_start,
      current_period_end: activeSub.current_period_end,
      cancel_at_period_end: activeSub.cancel_at_period_end,
      canceled_at: activeSub.canceled_at,
      gateway: activeSub.gateway,
      plan: activeSub.plan ? {
        id: activeSub.plan.id,
        code: activeSub.plan.code,
        name: activeSub.plan.name,
        price: activeSub.plan.price,
        currency: activeSub.plan.currency,
        billing_interval: activeSub.plan.billing_interval,
      } : null,
    } : null,
    latest_resume: latestResume ? {
      id: latestResume.id,
      file: latestResume.file,
      uploaded_at: latestResume.uploaded_at,
      analysis: latestResume.analysis,
    } : null,
    resumes_count: parseInt(json.resume_count || 0, 10),
    ai_analyses_count: parseInt(json.ai_analyses_count || 0, 10),
  };
};

export const updateUserStatusService = async (id, status) => {
  if (!Object.values(EntityType).includes(status)) {
    throw new Error('Invalid status value');
  }
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  
  user.status = status;
  await user.save();
  return user;
};

import { generateB2PresignedUrl, uploadToB2 } from '../../utils/backblaze.js';

export const getUserResumeService = async (id) => {
  const resume = await Resume.findOne({
    where: { user_id: id },
    include: [{ model: ResumeAnalysis, as: 'analysis' }],
    order: [['uploaded_at', 'DESC']]
  });
  
  if (!resume) return null;
  
  let key = resume.file;
  // Fallback for older resumes that stored the full URL instead of the key
  if (key.startsWith('http')) {
    const bucketStr = `${process.env.BACKBLAZE_BUCKET_NAME}/`;
    if (key.includes(bucketStr)) {
      key = key.split(bucketStr)[1];
    }
  }

  // Generate a fresh presigned URL for the admin to view
  return { 
    url: await generateB2PresignedUrl(key), 
    analysis: resume.analysis 
  };
};

export const getProfileService = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'username', 'email', 'phone', 'profile_pic', 'role', 'status']
  });

  if (!user) throw new Error('User not found');

  let photoUrl = null;
  if (user.profile_pic) {
    photoUrl = await generateB2PresignedUrl(user.profile_pic);
  }

  return { ...user.toJSON(), photoUrl };
};

export const updateProfileService = async (userId, data, file) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  // Update only allowed fields
  if (data.name) user.username = data.name;
  if (data.phone !== undefined) user.phone = data.phone; // allow clearing phone

  if (file) {
    const customKey = `profile_pics/${userId}/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const fileKey = await uploadToB2(file.originalname, file.buffer, file.mimetype, customKey);
    user.profile_pic = fileKey;
  }

  await user.save();

  let photoUrl = null;
  if (user.profile_pic) {
    photoUrl = await generateB2PresignedUrl(user.profile_pic);
  }

  return {
    id: user.id,
    name: user.username,
    email: user.email,
    phone: user.phone,
    photoUrl
  };
};
