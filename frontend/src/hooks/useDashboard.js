import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from '../api/dashboard.api';

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getDashboardStats().then((r) => r.data.data),
  });
