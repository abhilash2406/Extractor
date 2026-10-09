import React from 'react';
import { Sparkles, Zap, Layers } from 'lucide-react';

export const getPlanBadge = (planName, planCode) => {
  const code = (planCode || planName || 'FREE').toUpperCase();
  switch (code) {
    case 'PREMIUM':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs">
          <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500/20" />
          Premium
        </span>
      );
    case 'PRO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30 shadow-xs">
          <Zap className="h-3 w-3 text-violet-500 fill-violet-500/20" />
          Pro
        </span>
      );
    case 'BASIC':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-xs">
          <Layers className="h-3 w-3 text-blue-500" />
          Basic
        </span>
      );
    case 'FREE':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
          Free
        </span>
      );
  }
};

export const UserPlanBadge = ({ planName, planCode }) => {
  return getPlanBadge(planName, planCode);
};

export default UserPlanBadge;
