import { getDashboardStatsService } from './service.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const data = await getDashboardStatsService();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
