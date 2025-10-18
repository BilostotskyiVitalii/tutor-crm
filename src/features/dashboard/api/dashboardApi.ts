import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';

import { app } from '../../../app/firebase';

interface Student {
  id: string;
  name: string;
  totalHours: number;
  totalRevenue: number;
  avatar: string;
}

interface Group {
  id: string;
  title: string;
  totalHours: number;
  totalRevenue: number;
}

interface DashboardStats {
  activeStudents: number;
  newStudents: number;
  activeGroups: number;
  newGroups: number;
  topGroupsByHours: Group[];
  topGroupsByIncome: Group[];
  doneLessons: number;
  plannedLessons: number;
  currentMonthIncome: number;
  expectedMonthIncome: number;
  avgLessonPrice: number;
  averageHourPrice: number;
  averagePerHourStudentPrice: number;
  topStudentsByIncome: Student[];
  topStudentsByHours: Student[];
  revenueMixExpected: {
    individualPct: number; // 0..100
    groupPct: number; // 0..100
  };
  revenueMixCurrent: {
    individualPct: number; // 0..100
    groupPct: number; // 0..100
  };
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
