import User from '../../models/user.js';
import Resume from '../../models/resume.js';
import ResumeAnalysis from '../../models/resumeAnalysis.js';
import Template from '../../models/template.js';
import Subscription from '../../models/subscription.js';
import Plan from '../../models/plan.js';
import Test from '../../models/test.js';
import {
  FEATURE_COUNTER_KEYS,
  getFeatureCounter,
} from '../../models/featureCounter.js';
import { UserType } from '../../common/enum/usertype-enum.js';
import { EntityType } from '../../common/enum/activity-enum.js';
import { Op, fn, col, literal } from 'sequelize';

/**
 * Format relative time (e.g., '2 hours ago', '1 day ago')
 */
const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'Recently';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Helper to get user initials
 */
const getUserInitials = (name, email) => {
  const str = (name || email || '').trim();
  if (!str) return 'U';
  const clean = str.includes('@') ? str.split('@')[0] : str;
  const parts = clean.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase();
};

/**
 * Compute month-over-month percentage change string (e.g., '+12.5%' or '-4.1%')
 */
const calcMoMPercent = (current, previous) => {
  if (previous === 0 || !previous) {
    return current > 0 ? '+100.0%' : '+0.0%';
  }
  const pct = (((current - previous) / previous) * 100).toFixed(1);
  return parseFloat(pct) >= 0 ? `+${pct}%` : `${pct}%`;
};

/**
 * GET /api/v1/dashboard/stats
 * Overview numbers with month-over-month telemetry
 */
export const getDashboardStatsService = async () => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const [
    totalUsers,
    totalResumes,
    totalTemplates,
    totalAnalyses,
    activeUsers,
    usersThisMonth,
    usersLastMonth,
    activeNow,
    activePrev,
    resumesThisMonth,
    resumesLastMonth,
    coverLettersGenerated,
  ] = await Promise.all([
    User.count({ where: { role: UserType.USER, status: { [Op.ne]: EntityType.DELETED } } }),
    Resume.count(),
    Template.count(),
    ResumeAnalysis.count(),
    User.count({ where: { status: EntityType.ACTIVE } }),
    // Users registered this month
    User.count({
      where: {
        role: UserType.USER,
        status: { [Op.ne]: EntityType.DELETED },
        created_at: { [Op.gte]: thisMonthStart },
      },
    }),
    // Users registered last month
    User.count({
      where: {
        role: UserType.USER,
        status: { [Op.ne]: EntityType.DELETED },
        created_at: { [Op.between]: [lastMonthStart, lastMonthEnd] },
      },
    }),
    // Active users: logged in within last 30 days
    User.count({
      where: {
        last_login_at: { [Op.gte]: new Date(now.getTime() - 30 * 86400000) },
      },
    }),
    // Active users in previous 30-day window
    User.count({
      where: {
        last_login_at: {
          [Op.between]: [
            new Date(now.getTime() - 60 * 86400000),
            new Date(now.getTime() - 30 * 86400000),
          ],
        },
      },
    }),
    // Resumes created this month
    Resume.count({
      where: { uploaded_at: { [Op.gte]: thisMonthStart } },
    }),
    // Resumes created last month
    Resume.count({
      where: { uploaded_at: { [Op.between]: [lastMonthStart, lastMonthEnd] } },
    }),
    // Total cover letters generated (stateless counter)
    getFeatureCounter(FEATURE_COUNTER_KEYS.COVER_LETTER_GENERATED),
  ]);

  return {
    totalUsers,
    totalResumes,
    totalTemplates,
    totalAnalyses,
    coverLettersGenerated,
    totalAiUsage: totalAnalyses + coverLettersGenerated,
    activeUsers,
    usersGrowth: calcMoMPercent(usersThisMonth, usersLastMonth),
    activeGrowth: calcMoMPercent(activeNow, activePrev),
    resumesGrowth: calcMoMPercent(resumesThisMonth, resumesLastMonth),
    // Backward compatibility for existing endpoints
    totalJobRoles: totalResumes,
    pendingApplications: totalResumes,
    acceptedApplications: totalAnalyses,
  };
};

/**
 * GET /api/v1/dashboard/user-growth?months=10
 * Returns monthly user growth for Recharts AreaChart
 */
export const getUserGrowthService = async (months = 10) => {
  const data = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);

    const [users, active] = await Promise.all([
      User.count({
        where: {
          role: UserType.USER,
          status: { [Op.ne]: EntityType.DELETED },
          created_at: { [Op.lte]: monthEnd },
        },
      }),
      User.count({
        where: {
          last_login_at: { [Op.between]: [monthStart, monthEnd] },
        },
      }),
    ]);

    data.push({
      month: monthStart.toLocaleString('en-US', { month: 'short' }),
      users,
      active,
    });
  }

  // Calculate MTD percentage (latest month vs previous month)
  let mtdPercent = '+0.0%';
  if (data.length >= 2) {
    const latest = data[data.length - 1].users;
    const prev = data[data.length - 2].users;
    mtdPercent = calcMoMPercent(latest, prev);
  }

  return {
    growthData: data,
    mtdPercent,
  };
};

/**
 * GET /api/v1/dashboard/top-templates?limit=5
 * Returns top 5 used templates by volume of resumes
 */
export const getTopTemplatesService = async (limit = 5) => {
  // 1. Group resumes by template_id
  const usedTemplates = await Resume.findAll({
    where: { template_id: { [Op.ne]: null } },
    attributes: [
      'template_id',
      [fn('COUNT', col('Resume.id')), 'resume_count'],
    ],
    include: [
      {
        model: Template,
        as: 'template',
        attributes: ['id', 'name', 'code', 'category'],
      },
    ],
    group: ['Resume.template_id', 'template.id', 'template.name', 'template.code', 'template.category'],
    order: [[literal('resume_count'), 'DESC']],
    limit,
    subQuery: false,
  });

  const list = usedTemplates.map((r) => ({
    id: r.template?.id || r.template_id,
    name: r.template?.name || 'Standard Template',
    code: r.template?.code,
    category: r.template?.category,
    extractions: parseInt(r.dataValues.resume_count, 10) || 0,
  }));

  // If we have fewer than 5 used templates, fetch additional available templates to complete top 5
  if (list.length < limit) {
    const existingIds = list.map((t) => t.id).filter(Boolean);
    const remaining = await Template.findAll({
      where: existingIds.length ? { id: { [Op.notIn]: existingIds } } : {},
      attributes: ['id', 'name', 'code', 'category'],
      limit: limit - list.length,
      order: [['created_at', 'ASC']],
    });

    remaining.forEach((tpl) => {
      list.push({
        id: tpl.id,
        name: tpl.name,
        code: tpl.code,
        category: tpl.category,
        extractions: 0,
      });
    });
  }

  // Calculate percentages relative to the highest extraction count
  const maxCount = list.length > 0 ? Math.max(...list.map((t) => t.extractions), 1) : 1;

  return list.map((tpl) => ({
    ...tpl,
    percentage: maxCount > 0 && tpl.extractions > 0
      ? Math.max(12, Math.round((tpl.extractions / maxCount) * 100))
      : 0,
  }));
};

/**
 * GET /api/v1/dashboard/recent-users?limit=5
 * Returns latest 5 registered users with their active plan
 */
export const getRecentUsersService = async (limit = 5) => {
  const users = await User.findAll({
    where: {
      role: UserType.USER,
      status: { [Op.ne]: EntityType.DELETED },
    },
    attributes: ['id', 'username', 'email', 'status', 'profile_pic', 'created_at'],
    order: [['created_at', 'DESC']],
    limit,
    include: [
      {
        model: Subscription,
        as: 'subscriptions',
        attributes: ['id', 'status'],
        required: false,
        where: { status: 'ACTIVE' },
        limit: 1,
        include: [
          {
            model: Plan,
            as: 'plan',
            attributes: ['code', 'name'],
          },
        ],
      },
    ],
  });

  return users.map((u) => {
    const activeSub = u.subscriptions?.[0];
    const planName = activeSub?.plan?.name || 'Free';
    const name = u.username || (u.email ? u.email.split('@')[0] : 'User');

    return {
      id: u.id,
      name,
      email: u.email,
      plan: planName,
      initials: getUserInitials(name, u.email),
      joined: formatRelativeTime(u.created_at),
      createdAt: u.created_at,
    };
  });
};

/**
 * GET /api/v1/dashboard/candidate (candidate view)
 */
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
