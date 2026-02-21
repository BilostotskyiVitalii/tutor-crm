import { useGetDashboardStatsQuery } from '@/features/dashboard/api/dashboardApi';

export const useDashboardData = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery(undefined);

  return {
    data: data || {
      activeStudents: 0,
      newStudents: 0,
      activeGroups: 0,
      doneLessons: 0,
      plannedLessons: 0,
      avgLessonPrice: 0,
      totalRevenue: 0,
      topByLessons: '—',
      topByRevenue: '—',
    },
    isLoading,
    isError,
  };
};
