import Application from '../../models/application.js';
import JobRole from '../../models/jobRole.js';
import User from '../../models/user.js';
import Skill from '../../models/skill.js';
import Test from '../../models/test.js';
import TestAnswer from '../../models/testAnswer.js';
import Question from '../../models/question.js';
import { Op, literal } from 'sequelize';
import sequelize from '../../config/sequelize-config.js';
import { parsePagination, paginatedResponse } from '../../utils/pagination.js';
import { generateB2PresignedUrl, uploadToB2 } from '../../utils/backblaze.js';
import Resume from '../../models/resume.js';
import sendEmails from '../../utils/sendEmail.js';

export const getApplicationsService = async (query) => {
  const { page, limit, offset, sortBy, sortOrder, search } = parsePagination(query, 'applied_at');

  const where = {};
  const jobWhere = {};

  // Job-level filter by job_role_id
  if (query.job_role_id) {
    where.job_role_id = query.job_role_id;
  }

  // Skill-level filter: search inside matched_skills JSONB array
  if (query.skill) {
    where.matched_skills = literal(`matched_skills::text ILIKE '%${query.skill.replace(/'/g, "''")}%'`);
  }

  // Generic search on applicant name/email
  const userWhere = {};
  if (search) {
    userWhere[Op.or] = [
      { username: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await Application.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'candidate',
        attributes: ['id', 'username', 'email', 'phone'],
        where: Object.keys(userWhere).length ? userWhere : undefined,
        required: !!search,
      },
      {
        model: JobRole,
        as: 'job_role',
        attributes: ['id', 'title', 'min_experience'],
        include: [{ model: Skill, as: 'required_skills', attributes: ['id', 'name'] }],
        where: Object.keys(jobWhere).length ? jobWhere : undefined,
        required: Object.keys(jobWhere).length > 0,
      },
    ],
    order: [[sortBy, sortOrder]],
    limit,
    offset,
    distinct: true,
  });

  return paginatedResponse(rows, count, page, limit);
};


export const uploadResumeService = async (userId, fileBuffer, mimetype, originalname) => {
  if (!fileBuffer) {
    throw new Error('No file provided');
  }

  // Upload to Backblaze
  const customKey = `resumes/${userId}/${Date.now()}-${originalname.replace(/\s+/g, '_')}`;
  const fileKey = await uploadToB2(originalname, fileBuffer, mimetype, customKey);
  
  // Upsert resume in database (store the key, not the public URL, so we can generate signed URLs later)
  let resume = await Resume.findOne({ where: { user_id: userId } });
  if (resume) {
    resume.file = fileKey;
    await resume.save();
  } else {
    resume = await Resume.create({
      user_id: userId,
      file: fileKey,
    });
  }

  // Generate a presigned URL valid for 1 hour for immediate frontend preview
  const presignedUrl = await generateB2PresignedUrl(fileKey);

  return { url: presignedUrl, resume };
};

export const createApplicationService = async (userId, jobRoleId) => {
  if (!jobRoleId) {
    throw new Error('Job Role ID is required');
  }

  // Check if job exists
  const job = await JobRole.findByPk(jobRoleId);
  if (!job) {
    throw new Error('Job Role not found');
  }

  // Check if already applied
  const existingApp = await Application.findOne({
    where: { user_id: userId, job_role_id: jobRoleId },
  });

  if (existingApp) {
    throw new Error('You have already applied for this job');
  }

  const application = await Application.create({
    user_id: userId,
    job_role_id: jobRoleId,
    status: 'pending',
    // match_score and skills can be processed asynchronously or by a separate worker/service later
  });

  return application;
};

export const getMyApplicationsService = async (userId) => {
  const applications = await Application.findAll({
    where: { user_id: userId },
    include: [
      {
        model: JobRole,
        as: 'job_role',
        attributes: ['id', 'title', 'min_experience', 'status', 'last_application_date'],
      }
    ],
    order: [['applied_at', 'DESC']],
  });
  return applications;
};

export const getCurrentResumeService = async (userId) => {
  const resume = await Resume.findOne({
    where: { user_id: userId },
    order: [['uploaded_at', 'DESC']]
  });
  
  if (!resume) return null;

  let key = resume.file;
  // Fallback for older resumes
  if (key.startsWith('http')) {
    const bucketStr = `${process.env.BACKBLAZE_BUCKET_NAME}/`;
    if (key.includes(bucketStr)) {
      key = key.split(bucketStr)[1];
    }
  }

  const presignedUrl = await generateB2PresignedUrl(key);
  return { url: presignedUrl, resume };
};

const sendRejectionEmail = async (application) => {
  try {
    await sendEmails({
      mailOptions: {
        to: application.candidate.email,
        subject: `Update regarding your application for ${application.job_role?.title}`
      },
      fileName: 'rejection-email.ejs',
      contentVariables: {
        candidateName: application.candidate.username,
        jobTitle: application.job_role?.title || 'the position'
      }
    });
  } catch (err) {
    console.error('Failed to send rejection email:', err);
  }
};

const sendNextRoundEmail = async (application) => {
  try {
    await sendEmails({
      mailOptions: {
        to: application.candidate.email,
        subject: `Congratulations! You've moved to the next round for ${application.job_role?.title}`
      },
      fileName: 'next-round-email.ejs',
      contentVariables: {
        candidateName: application.candidate.username,
        jobTitle: application.job_role?.title || 'the position'
      }
    });
  } catch (err) {
    console.error('Failed to send next round email:', err);
  }
};

const generateTestForApplication = async (application, transaction) => {
  const questions = await Question.findAll({
    order: sequelize.random(),
    limit: 10,
    transaction
  });

  if (questions.length === 0) {
    throw new Error(`Cannot proceed: No questions exist in the database. Please add questions first.`);
  }

  const test = await Test.create({
    user_id: application.candidate.id,
    application_id: application.id,
    total_questions: questions.length,
    score: null,
    is_completed: false
  }, { transaction });

  const testAnswers = questions.map(q => ({
    test_id: test.id,
    question_id: q.id
  }));

  await TestAnswer.bulkCreate(testAnswers, { transaction });
};

export const updateApplicationStatusService = async (id, status) => {
  const application = await Application.findByPk(id, {
    include: [
      { model: User, as: 'candidate', attributes: ['id', 'username', 'email'] },
      { model: JobRole, as: 'job_role', attributes: ['id', 'title'] }
    ]
  });
  if (!application) {
    throw new Error('Application not found');
  }

  // Check if status is transitioning
  const isNewlyRejected = status === 'rejected' && application.status !== 'rejected';
  const isNewlyNextRound = status === 'next_round' && application.status !== 'next_round';

  // Execute DB changes in a transaction
  await sequelize.transaction(async (t) => {
    // Update status
    application.status = status;
    await application.save({ transaction: t });

    if (isNewlyNextRound && application.candidate?.email) {
      await generateTestForApplication(application, t);
    }
  });

  // Send emails asynchronously only AFTER the transaction has successfully committed
  if (isNewlyRejected && application.candidate?.email) {
    sendRejectionEmail(application);
  }
  
  if (isNewlyNextRound && application.candidate?.email) {
    sendNextRoundEmail(application);
  }

  return application;
};
