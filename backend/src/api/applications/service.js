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
import ResumeAnalysis from '../../models/resumeAnalysis.js';
import sendEmails from '../../utils/sendEmail.js';
import { parseResumeAndSave } from '../../utils/resumeParser.js';

export const getApplicationsService = async (query) => {
  const { page, limit, offset, sortBy, sortOrder, search } = parsePagination(query, 'updated_at');

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
    attributes: { exclude: ['matched_skills', 'missing_skills'] },
    include: [
      {
        model: User,
        as: 'candidate',
        attributes: ['id', 'username', 'email'],
        where: Object.keys(userWhere).length ? userWhere : undefined,
        required: !!search,
      },
      {
        model: JobRole,
        as: 'job_role',
        attributes: ['id', 'title'],
        where: Object.keys(jobWhere).length ? jobWhere : undefined,
        required: Object.keys(jobWhere).length > 0,
      }
    ],
    order: [[sortBy, sortOrder]],
    limit,
    offset,
    distinct: true,
  });

  return paginatedResponse(rows, count, page, limit);
};

export const getApplicationService = async (id) => {
  const application = await Application.findByPk(id, {
    include: [
      {
        model: User,
        as: 'candidate',
        attributes: ['id', 'username', 'email', 'phone', 'website', 'linkedin_url', 'github_url'],
      },
      {
        model: JobRole,
        as: 'job_role',
        attributes: ['id', 'title', 'min_experience', 'status', 'last_application_date'],
      },
      {
        model: Test,
        as: 'tests',
        attributes: ['id', 'score', 'is_completed', 'test_type']
      }
    ]
  });

  if (!application) {
    throw new Error('Application not found');
  }

  return application;
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

  // Parse resume and extract data asynchronously
  parseResumeAndSave(fileBuffer, mimetype, resume.id);

  // Generate a presigned URL valid for 1 hour for immediate frontend preview
  const presignedUrl = await generateB2PresignedUrl(fileKey);

  return { url: presignedUrl, resume };
};

export const createApplicationService = async (userId, jobRoleId) => {
  if (!jobRoleId) {
    throw new Error('Job Role ID is required');
  }

  // Check if job exists
  const job = await JobRole.findByPk(jobRoleId, {
    include: [{ model: Skill, as: 'required_skills' }]
  });
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

  let matched_skills = [];
  let missing_skills = [];
  let match_score = null;

  const resume = await Resume.findOne({
    where: { user_id: userId },
    include: [{ model: ResumeAnalysis, as: 'analysis' }],
    order: [['uploaded_at', 'DESC']]
  });

  if (job.required_skills && job.required_skills.length > 0 && resume && resume.analysis && resume.analysis.extracted_skills) {
    const candidateSkills = resume.analysis.extracted_skills.map(s => s.toLowerCase());

    matched_skills = job.required_skills.filter(s => 
      candidateSkills.some(cs => cs.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(cs))
    ).map(s => s.name);
    
    missing_skills = job.required_skills.filter(s => !matched_skills.includes(s.name)).map(s => s.name);
    match_score = Math.round((matched_skills.length / job.required_skills.length) * 100);
  }

  const application = await Application.create({
    user_id: userId,
    job_role_id: jobRoleId,
    status: 'pending',
    matched_skills: matched_skills.length > 0 ? matched_skills : null,
    missing_skills: missing_skills.length > 0 ? missing_skills : null,
    match_score: match_score,
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

const sendAcceptedEmail = async (application) => {
  try {
    await sendEmails({
      mailOptions: {
        to: application.candidate.email,
        subject: `Offer of Employment: ${application.job_role?.title}`
      },
      fileName: 'accepted-email.ejs',
      contentVariables: {
        candidateName: application.candidate.username,
        jobTitle: application.job_role?.title || 'the position'
      }
    });
  } catch (err) {
    console.error('Failed to send accepted email:', err);
  }
};

const sendInterviewEmail = async (application, interviewDate, interviewTime) => {
  try {
    const formattedDate = new Date(interviewDate).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    // Convert 24h to 12h time format for better readability
    const [hours, minutes] = interviewTime.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedTime = `${h % 12 || 12}:${minutes} ${ampm}`;

    await sendEmails({
      mailOptions: {
        to: application.candidate.email,
        subject: `Interview Invitation: Face-to-Face round for ${application.job_role?.title}`
      },
      fileName: 'interview-email.ejs',
      contentVariables: {
        candidateName: application.candidate.username,
        jobTitle: application.job_role?.title || 'the position',
        interviewDate: formattedDate,
        interviewTime: formattedTime,
        location: 'Abc Pvt Ltd, 123 Tech Park, Innovation City'
      }
    });
  } catch (err) {
    console.error('Failed to send interview email:', err);
  }
};

const generateTestForApplication = async (application, transaction, testType = 'APTITUDE') => {
  const isTechnical = testType === 'TECHNICAL';
  const questionType = isTechnical ? 'PROGRAMMING' : 'MCQ';
  const limit = isTechnical ? 2 : 10;

  const questions = await Question.findAll({
    where: { type: questionType },
    order: sequelize.random(),
    limit: limit,
    transaction
  });

  if (questions.length === 0) {
    throw new Error(`Cannot proceed: No ${questionType} questions exist in the database. Please add questions first.`);
  }

  const test = await Test.create({
    user_id: application.candidate.id,
    application_id: application.id,
    test_type: testType,
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

export const updateApplicationStatusService = async (id, status, interviewDate, interviewTime) => {
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
  const isNewlyAccepted = status === 'accepted' && application.status !== 'accepted';
  const isNewlyAptitudeRound = status === 'aptitude_round' && application.status !== 'aptitude_round';
  const isNewlyTechnicalRound = status === 'technical_round' && application.status !== 'technical_round';
  const isNewlyInterview = status === 'face_to_face_interview' && application.status !== 'face_to_face_interview';

  // Execute DB changes in a transaction
  await sequelize.transaction(async (t) => {
    // Update status
    application.status = status;
    await application.save({ transaction: t });

    if (isNewlyAptitudeRound && application.candidate?.email) {
      await generateTestForApplication(application, t, 'APTITUDE');
    }
    
    if (isNewlyTechnicalRound && application.candidate?.email) {
      await generateTestForApplication(application, t, 'TECHNICAL');
    }
  });

  // Send emails asynchronously only AFTER the transaction has successfully committed
  if (isNewlyRejected && application.candidate?.email) {
    sendRejectionEmail(application);
  }
  
  if (isNewlyAccepted && application.candidate?.email) {
    sendAcceptedEmail(application);
  }
  
  if ((isNewlyAptitudeRound || isNewlyTechnicalRound) && application.candidate?.email) {
    sendNextRoundEmail(application);
  }
  
  if (isNewlyInterview && application.candidate?.email && interviewDate && interviewTime) {
    sendInterviewEmail(application, interviewDate, interviewTime);
  }

  return application;
};
