import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from '@/api/dashboard.api';

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getDashboardStats().then((r) => r.data.data),
    staleTime: 30 * 1000,
  });

export const useUserGrowth = (months = 10) =>
  useQuery({
    queryKey: ['dashboard-user-growth', months],
    queryFn: () => dashboardApi.getUserGrowth(months).then((r) => r.data.data),
    staleTime: 60 * 1000,
  });

export const useTopTemplates = (limit = 5) =>
  useQuery({
    queryKey: ['dashboard-top-templates', limit],
    queryFn: () => dashboardApi.getTopTemplates(limit).then((r) => r.data.data),
    staleTime: 30 * 1000,
  });

export const useRecentUsers = (limit = 5) =>
  useQuery({
    queryKey: ['dashboard-recent-users', limit],
    queryFn: () => dashboardApi.getRecentUsers(limit).then((r) => r.data.data),
    staleTime: 30 * 1000,
  });

export const useCandidateDashboardStats = () =>
  useQuery({
    queryKey: ['candidate-dashboard-stats'],
    queryFn: () => dashboardApi.getCandidateDashboardStats().then((r) => r.data.data),
  });
