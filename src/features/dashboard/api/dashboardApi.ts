import { createApi } from '@reduxjs/toolkit/query/react';

import type {
  DashboardStats,
  DashboardStatsRes,
} from '@/features/dashboard/types/dashboardStats';
import { baseQueryWithAuth } from '@/shared/api/baseQueryWithAuth';
import { endpointsURL } from '@/shared/constants/endpointsUrl';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['DashboardStats'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, DashboardStatsRes>({
      query: ({ start, end }) => {
        const params = new URLSearchParams();
        if (start) {
          params.append('start', start);
        }
        if (end) {
          params.append('end', end);
        }
        return `${endpointsURL.dashboardStats}?${params.toString()}`;
      },
      providesTags: ['DashboardStats'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
