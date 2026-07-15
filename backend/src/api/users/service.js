import User from '../../models/user.js';
import Resume from '../../models/resume.js';
import ResumeAnalysis from '../../models/resumeAnalysis.js';
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
  if (search) {
    where[Op.or] = [
      { username: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: ['id', 'username', 'email', 'role', 'status', 'created_at'],
    order: [[sortBy, sortOrder]],
    limit,
    offset,
  });

  return paginatedResponse(rows, count, page, limit);
};

export const getUserService = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
  if (!user) throw new Error('User not found');
  return user;
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
