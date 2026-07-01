import User from '../../models/user.js';
import JobRole from '../../models/jobRole.js';
import Application from '../../models/application.js';
import { UserType } from '../../common/enum/usertype-enum.js';
import { EntityType } from '../../common/enum/activity-enum.js';

export const getDashboardStatsService = async () => {
  const [
    totalCandidates,
    totalJobRoles,
    pendingApplications,
    approvedCandidates
  ] = await Promise.all([
    User.count({ where: { role: UserType.CANDIDATE } }),
    JobRole.count({ where: { status: EntityType.ACTIVE } }),
    Application.count({ where: { status: 'pending' } }),
    Application.count({ where: { status: 'accepted' } })
  ]);

  return {
    totalCandidates,
    totalJobRoles,
    pendingApplications,
    approvedCandidates
  };
};
