import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';

import { app } from '../../../app/firebase';

interface DashboardStats {
  activeStudents: number;
  newStudents: number;
  activeGroups: number;
  doneLessons: number;
  plannedLessons: number;
  avgLessonPrice: number;
  totalRevenue: number;
  topByLessons: string;
  topByRevenue: string;
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://us-central1-tutor-crm-49cae.cloudfunctions.net/',
    prepareHeaders: async (headers) => {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => 'getDashboardStats',
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
