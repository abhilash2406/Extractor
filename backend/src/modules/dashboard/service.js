import User from '../../models/user.js';
import Resume from '../../models/resume.js';
import ResumeAnalysis from '../../models/resumeAnalysis.js';
import Test from '../../models/test.js';
import { UserType } from '../../common/enum/usertype-enum.js';
import { EntityType } from '../../common/enum/activity-enum.js';
import { Op } from 'sequelize';
import moment from 'moment';

export const getDashboardStatsService = async () => {
  const [
    totalUsers,
    totalResumes,
    totalAnalyses,
    activeUsers
  ] = await Promise.all([
    User.count({ where: { role: UserType.USER, status: { [Op.ne]: EntityType.DELETED } } }),
    Resume.count(),
    ResumeAnalysis.count(),
    User.count({ where: { status: EntityType.ACTIVE } })
  ]);

  const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
  const recentResumes = await Resume.findAll({
    where: { uploaded_at: { [Op.gte]: thirtyDaysAgo } },
    attributes: ['uploaded_at']
  });

  const timeMap = {};
  for (let i = 29; i >= 0; i--) {
    timeMap[moment().subtract(i, 'days').format('MMM DD')] = 0;
  }
  
  recentResumes.forEach(r => {
    const dateStr = moment(r.uploaded_at).format('MMM DD');
    if (timeMap[dateStr] !== undefined) {
      timeMap[dateStr]++;
    }
  });

  const applicationsOverTime = Object.keys(timeMap).map(date => ({
    date,
    count: timeMap[date]
  }));

  const applicationsByStatus = [
    { name: 'Active Users', value: activeUsers },
    { name: 'Resumes Analyzed', value: totalAnalyses },
    { name: 'Resumes Uploaded', value: totalResumes }
  ];

  return {
    totalUsers,
    totalJobRoles: totalResumes,
    pendingApplications: totalResumes,
    acceptedApplications: totalAnalyses,
    applicationsByStatus,
    applicationsOverTime
  };
};

export const getCandidateDashboardStatsService = async (candidateId) => {
  const [
    totalResumes,
    completedTests,
    recentResumes
  ] = await Promise.all([
    Resume.count({ where: { user_id: candidateId } }),
    Test.count({ where: { user_id: candidateId, is_completed: true } }),
    Resume.findAll({
      where: { user_id: candidateId },
      order: [['uploaded_at', 'DESC']],
      limit: 5,
      include: [{ model: ResumeAnalysis, as: 'analysis' }]
    })
  ]);

  return {
    totalApplications: totalResumes,
    pendingApplications: totalResumes,
    completedTests,
    recentApplications: recentResumes
  };
};
