import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Spin } from 'antd';

import { navigationUrls } from '@/shared/constants/navigationUrls';

const DashboardPage = lazy(() => import('@/pages/DashboardPage/DashboardPage'));
const StudentsPage = lazy(() => import('@/pages/StudentsPage/StudentsPage'));
const StudentIdPage = lazy(() => import('@/pages/StudentIdPage/StudentIdPage'));
const SchedulePage = lazy(() => import('@/pages/SchedulePage/SchedulePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage/SettingsPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage/AnalyticsPage'));
const GroupsPage = lazy(() => import('@/pages/GroupsPage/GroupsPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<Spin fullscreen size="large" />}>
      <Routes>
        <Route path={navigationUrls.dashboard} element={<DashboardPage />} />
        <Route path={navigationUrls.students} element={<StudentsPage />} />
        <Route path={navigationUrls.student} element={<StudentIdPage />} />
        <Route path={navigationUrls.schedule} element={<SchedulePage />} />
        <Route path={navigationUrls.settings} element={<SettingsPage />} />
        <Route path={navigationUrls.analytics} element={<AnalyticsPage />} />
        <Route path={navigationUrls.groups} element={<GroupsPage />} />

        <Route
          path=""
          element={<Navigate to={navigationUrls.dashboard} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={navigationUrls.dashboard} replace />}
        />
      </Routes>
    </Suspense>
  );
}
