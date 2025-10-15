import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';

import { db } from '@/app/firebase';
import type { Group } from '@/features/groups/types/groupTypes';
import type { Lesson } from '@/features/lessons/types/lessonTypes';
import type { Student } from '@/features/students/types/studentTypes';

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
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      async queryFn() {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) {
            throw new Error('User not authenticated');
          }

          const userPath = `users/${user.uid}`;
          const now = Timestamp.now();
          const monthStart = Timestamp.fromDate(
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          );
          const monthEnd = Timestamp.fromDate(
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          );

          // --- Students ---
          const studentsSnap = await getDocs(
            collection(db, `${userPath}/groups`),
          );

          const students: Student[] = studentsSnap.docs.map((doc) => {
            const data = doc.data() as Omit<Student, 'id'>;
            return {
              id: doc.id,
              ...data,
            };
          });

          //active
          const activeStudentsQuery = query(
            collection(db, `${userPath}/students`),
            where('isActive', '==', true),
          );
          const activeStudentsSnap = await getDocs(activeStudentsQuery);
          const activeStudents = activeStudentsSnap.size;

          // new this month
          const newStudentsQuery = query(
            collection(db, `${userPath}/students`),
            where('createdAt', '>=', monthStart),
            where('createdAt', '<=', now),
          );
          const newStudentsSnap = await getDocs(newStudentsQuery);
          const newStudents = newStudentsSnap.size;

          // --- Groups ---
          const groupsSnap = await getDocs(
            collection(db, `${userPath}/groups`),
          );

          const groups: Group[] = groupsSnap.docs.map((doc) => {
            const data = doc.data() as Omit<Group, 'id'>;
            return {
              id: doc.id,
              ...data,
            };
          });

          const activeGroups = groups.filter(
            (g) => (g.studentIds || []).length > 0,
          ).length;

          // --- Lessons ---
          const lessonsSnap = await getDocs(
            collection(db, `${userPath}/lessons`),
          );

          const lessons: Lesson[] = lessonsSnap.docs.map((doc) => {
            const data = doc.data() as Omit<Lesson, 'id'>;
            return {
              id: doc.id,
              ...data,
            };
          });

          // Done lessons
          const doneLessonsQuery = query(
            collection(db, `${userPath}/lessons`),
            where('end', '>=', monthStart),
            where('end', '<=', now),
          );
          const doneLessonsSnap = await getDocs(doneLessonsQuery);
          const doneLessons = doneLessonsSnap.size;

          // Planned lessons
          const plannedLessonsQuery = query(
            collection(db, `${userPath}/lessons`),
            where('start', '>=', now),
            where('start', '<=', monthEnd),
          );
          const plannedLessonsSnap = await getDocs(plannedLessonsQuery);
          const plannedLessons = plannedLessonsSnap.size;

          // Avg price & total revenue
          const avgLessonPrice =
            lessons.length > 0
              ? lessons.reduce((sum, l) => sum + (l.price || 0), 0) /
                lessons.length
              : 0;
          const totalRevenue = lessons.reduce(
            (sum, l) => sum + (l.price || 0),
            0,
          );

          // Top by lessons
          const lessonsMap: Record<string, number> = {};
          const revenueMap: Record<string, number> = {};

          lessons.forEach((l) => {
            (l.students || []).forEach((s) => {
              lessonsMap[s.id] = (lessonsMap[s.id] || 0) + 1;
              revenueMap[s.id] = (revenueMap[s.id] || 0) + (l.price || 0);
            });
          });

          const topByLessonsId = Object.entries(lessonsMap).sort(
            (a, b) => b[1] - a[1],
          )[0]?.[0];
          const topByLessons =
            students.find((s) => s.id === topByLessonsId)?.name || '—';

          const topByRevenueId = Object.entries(revenueMap).sort(
            (a, b) => b[1] - a[1],
          )[0]?.[0];
          const topByRevenue =
            students.find((s) => s.id === topByRevenueId)?.name || '—';

          return {
            data: {
              activeStudents,
              newStudents,
              activeGroups,
              doneLessons,
              plannedLessons,
              avgLessonPrice,
              totalRevenue,
              topByLessons,
              topByRevenue,
            },
          };
        } catch (err) {
          return {
            error: { status: 'FETCH_ERROR', error: (err as Error).message },
          };
        }
      },
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
