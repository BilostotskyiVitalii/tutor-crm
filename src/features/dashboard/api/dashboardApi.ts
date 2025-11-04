import { createApi } from '@reduxjs/toolkit/query/react';

import type { DashboardStats } from '@/features/dashboard/types/dashboardStats';
import { baseQueryWithAuth } from '@/shared/api/baseQueryWithAuth';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['DashboardStats'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({ url: 'dashboard/stats', method: 'GET' }),
      providesTags: ['DashboardStats'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
