import Skill from '../../models/skill.js';
import BadRequest from '../../common/exceptions/badRequest.js';
import { Op } from 'sequelize';
import { parsePagination, paginatedResponse } from '../../utils/pagination.js';

export const createSkillService = async (data) => {
  const existingSkill = await Skill.findOne({ where: { name: data.name } });
  if (existingSkill) {
    throw new BadRequest('Skill with this name already exists');
  }
  return await Skill.create(data);
};

export const getSkillsService = async (query = {}) => {
  const { page, limit, offset, sortBy, sortOrder, search } = parsePagination(query, 'name');

  const where = {};
  if (search) {
    where.name = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows } = await Skill.findAndCountAll({
    where,
    order: [[sortBy, sortOrder]],
    limit,
    offset,
  });

  return paginatedResponse(rows, count, page, limit);
};

export const deleteSkillService = async (id) => {
  const skill = await Skill.findOne({ where: { id } });

  if (!skill) {
    throw new BadRequest('Skill not found');
  }

  await skill.destroy();
  return { message: 'Skill deleted successfully' };
};

