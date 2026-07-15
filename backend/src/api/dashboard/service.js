import User from '../../models/user.js';
import JobRole from '../../models/jobRole.js';
import Application from '../../models/application.js';
import { UserType } from '../../common/enum/usertype-enum.js';
import { EntityType } from '../../common/enum/activity-enum.js';
import sequelize from '../../config/sequelize-config.js';
import { Op } from 'sequelize';
import moment from 'moment';

export const getDashboardStatsService = async () => {
  const [
    totalCandidates,
    totalJobRoles,
    pendingApplications,
    approvedCandidates,
    statusAggregation
  ] = await Promise.all([
    User.count({ where: { role: UserType.CANDIDATE } }),
    JobRole.count({ where: { status: EntityType.ACTIVE } }),
    Application.count({ where: { status: 'pending' } }),
    Application.count({ where: { status: 'accepted' } }),
    Application.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status']
    })
  ]);

  const applicationsByStatus = statusAggregation.map(s => ({
    name: s.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: parseInt(s.dataValues.count, 10)
  }));

  const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
  const recentApps = await Application.findAll({
    where: { applied_at: { [Op.gte]: thirtyDaysAgo } },
    attributes: ['applied_at']
  });

  const timeMap = {};
  for (let i = 29; i >= 0; i--) {
    timeMap[moment().subtract(i, 'days').format('MMM DD')] = 0;
  }
  
  recentApps.forEach(app => {
    const dateStr = moment(app.applied_at).format('MMM DD');
    if (timeMap[dateStr] !== undefined) {
      timeMap[dateStr]++;
    }
  });

  const applicationsOverTime = Object.keys(timeMap).map(date => ({
    date,
    count: timeMap[date]
  }));

  return {
    totalCandidates,
    totalJobRoles,
    pendingApplications,
    approvedCandidates,
    applicationsByStatus,
    applicationsOverTime
  };
};
