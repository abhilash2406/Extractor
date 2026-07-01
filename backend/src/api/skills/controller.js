import {
  createSkillService,
  getSkillsService,
  deleteSkillService,
} from './service.js';

export const createSkill = async (req, res, next) => {
  try {
    const data = await createSkillService(req.body);
    return res.status(201).json({ success: true, message: 'Skill created successfully', data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getSkills = async (req, res, next) => {
  try {
    const result = await getSkillsService(req.query);
    return res.json({ success: true, ...result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const data = await deleteSkillService(req.params.id);
    return res.json({ success: true, message: data.message });
  } catch (e) {
    const status = e.message === 'Skill not found' ? 404 : 400;
    return res.status(status).json({ success: false, message: e.message });
  }
};
