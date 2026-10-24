import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import moment from 'moment';

export const useUserFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current parameters with fallbacks
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const selectedPlan = searchParams.get('plan') || 'ALL';
  const selectedStatus = searchParams.get('status') || 'ALL';
  const dateRangePreset = searchParams.get('datePreset') || 'all';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  // Helper to update specific search params and reset page to 1
  const updateParams = useCallback(
    (updates, resetPage = true) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (
              value === undefined ||
              value === null ||
              value === '' ||
              value === 'ALL' ||
              (key === 'datePreset' && value === 'all')
            ) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          });
          if (resetPage) {
            next.delete('page');
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSearch = useCallback(
    (val) => updateParams({ search: val ? val : undefined }),
    [updateParams]
  );

  const setSelectedPlan = useCallback(
    (val) => updateParams({ plan: val }),
    [updateParams]
  );

  const setSelectedStatus = useCallback(
    (val) => updateParams({ status: val }),
    [updateParams]
  );

  const handleDatePresetChange = useCallback(
    (preset) => {
      if (preset === 'last_7_days') {
        updateParams({
          datePreset: 'last_7_days',
          startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
        });
      } else if (preset === 'last_30_days') {
        updateParams({
          datePreset: 'last_30_days',
          startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
        });
      } else if (preset === 'custom') {
        updateParams({
          datePreset: 'custom',
        });
      } else {
        updateParams({
          datePreset: undefined,
          startDate: undefined,
          endDate: undefined,
        });
      }
    },
    [updateParams]
  );

  const setStartDate = useCallback(
    (val) => updateParams({ startDate: val, datePreset: 'custom' }),
    [updateParams]
  );

  const setEndDate = useCallback(
    (val) => updateParams({ endDate: val, datePreset: 'custom' }),
    [updateParams]
  );

  const setPage = useCallback(
    (newPage) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newPage <= 1) {
            next.delete('page');
          } else {
            next.set('page', String(newPage));
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        search ||
          selectedPlan !== 'ALL' ||
          selectedStatus !== 'ALL' ||
          dateRangePreset !== 'all' ||
          startDate ||
          endDate
      ),
    [search, selectedPlan, selectedStatus, dateRangePreset, startDate, endDate]
  );

  // Ready-to-use params object for TanStack Query
  const queryParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      plan: selectedPlan !== 'ALL' ? selectedPlan : undefined,
      status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [page, search, selectedPlan, selectedStatus, startDate, endDate]
  );

  return {
    page,
    search,
    selectedPlan,
    selectedStatus,
    dateRangePreset,
    startDate,
    endDate,
    hasActiveFilters,
    queryParams,
    setSearch,
    setSelectedPlan,
    setSelectedStatus,
    handleDatePresetChange,
    setStartDate,
    setEndDate,
    setPage,
    resetFilters,
  };
};

export default useUserFilters;
