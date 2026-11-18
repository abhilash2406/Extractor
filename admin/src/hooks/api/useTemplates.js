import { useInfiniteQuery } from '@tanstack/react-query';
import { getTemplates } from '@/api/templates.api';

/**
 * Cursor-based infinite scrolling hook for Admin Resume Templates
 * @param {Object} filters - { search, category, status, limit }
 */
export const useInfiniteTemplates = ({
  search = '',
  category = 'All',
  status = 'All',
  limit = 9,
} = {}) => {
  return useInfiniteQuery({
    queryKey: ['admin-templates', search, category, status, limit],
    queryFn: async ({ pageParam }) => {
      const res = await getTemplates({
        cursor: pageParam || undefined,
        limit,
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        status: status !== 'All' ? status.toLowerCase() : undefined,
      });
      return {
        data: res.data?.data || [],
        meta: res.data?.meta || { hasMore: false, nextCursor: null, limit },
      };
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.hasMore && lastPage?.meta?.nextCursor
        ? lastPage.meta.nextCursor
        : undefined,
    staleTime: 30 * 1000,
  });
};
