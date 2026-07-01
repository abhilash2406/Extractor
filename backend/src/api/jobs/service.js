import JobRole from '../../models/jobRole.js';
import Skill from '../../models/skill.js';
import sequelize from '../../config/sequelize-config.js';
import { EntityType } from '../../common/enum/activity-enum.js';
import BadRequest from '../../common/exceptions/badRequest.js';
import { Op } from 'sequelize';
import { parsePagination, paginatedResponse } from '../../utils/pagination.js';

export const createJobService = async (data) => {
  return await sequelize.transaction(async (t) => {
    const job = await JobRole.create(data, { transaction: t });

    if (data.skill_ids && data.skill_ids.length > 0) {
      await job.setRequired_skills(data.skill_ids, { transaction: t });
    }

    return await JobRole.findByPk(job.id, {
      include: [{ model: Skill, as: 'required_skills' }],
      transaction: t,
    });
  });
};

export const getJobsService = async (query = {}) => {
  const { page, limit, offset, sortBy, sortOrder, search } = parsePagination(query, 'created_at');

  const where = { status: EntityType.ACTIVE };
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Filter by skill_id through the required_skills junction table
  const skillInclude = {
    model: Skill,
    as: 'required_skills',
    ...(query.skill_id
      ? { where: { id: query.skill_id }, required: true }
      : { required: false }),
  };

  const { count, rows } = await JobRole.findAndCountAll({
    where,
    include: [skillInclude],
    order: [[sortBy, sortOrder]],
    limit,
    offset,
    distinct: true,
  });

  return paginatedResponse(rows, count, page, limit);
};


export const getJobByIdService = async (id) => {
  const job = await JobRole.findOne({
    where: { id, status: EntityType.ACTIVE },
    include: [{ model: Skill, as: 'required_skills' }],
  });
  if (!job) throw new BadRequest('Job not found');
  return job;
};

export const updateJobService = async (id, data) => {
  return await sequelize.transaction(async (t) => {
    const job = await JobRole.findOne({
      where: { id, status: EntityType.ACTIVE },
      transaction: t,
    });

    if (!job) throw new BadRequest('Job not found');

    await job.update(data, { transaction: t });

    if (data.skill_ids) {
      await job.setRequired_skills(data.skill_ids, { transaction: t });
    }

    return await JobRole.findByPk(job.id, {
      include: [{ model: Skill, as: 'required_skills' }],
      transaction: t,
    });
  });
};

export const deleteJobService = async (id) => {
  const job = await JobRole.findOne({
    where: { id, status: EntityType.ACTIVE },
  });

  if (!job) throw new BadRequest('Job not found');

  await job.update({ status: EntityType.DELETED });
  return { message: 'Job deleted successfully' };
};


