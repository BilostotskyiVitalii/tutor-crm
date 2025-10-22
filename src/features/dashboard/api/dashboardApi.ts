import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithAuth } from '@/app/api/baseQueryWithAuth';
import type { DashboardStats } from '@/features/dashboard/types/dashboardStats';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({ url: 'dashboard/stats', method: 'GET' }),
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
