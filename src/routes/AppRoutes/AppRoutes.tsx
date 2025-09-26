import { type FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from 'antd';

import {
  AnalyticsPage,
  DashboardPage,
  GroupsPage,
  SchedulePage,
  SettingsPage,
  StudentIdPage,
  StudentsPage,
} from '@/pages';
import { navigationUrls } from '@/shared/constants/navigationUrls';

import styles from './AppRoutes.module.scss';

const { Content } = Layout;
const {
  dashboard,
  students,
  student,
  schedule,
  settings,
  analytics,
  index,
  groups,
} = navigationUrls;

const AppRoutes: FC = () => {
  const routes = [
    { path: dashboard, element: <DashboardPage /> },
    { path: students, element: <StudentsPage /> },
    { path: schedule, element: <SchedulePage /> },
    { path: analytics, element: <AnalyticsPage /> },
    { path: settings, element: <SettingsPage /> },
    { path: student, element: <StudentIdPage /> },
    { path: groups, element: <GroupsPage /> },
  ];

  return (
    <Content className={styles.content}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path={index} element={<Navigate to={dashboard} />} />
        <Route path="*" element={<Navigate to={dashboard} replace />} />
      </Routes>
    </Content>
  );
};

export default AppRoutes;
