import { type FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from 'antd';

import { navigationUrls } from '@/constants/navigationUrls';
import {
  Analytics,
  Dashboard,
  GroupsPage,
  SchedulePage,
  Settings,
  StudentPage,
  Students,
} from '@/pages';

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
    { path: dashboard, element: <Dashboard /> },
    { path: students, element: <Students /> },
    { path: schedule, element: <SchedulePage /> },
    { path: analytics, element: <Analytics /> },
    { path: settings, element: <Settings /> },
    { path: student, element: <StudentPage /> },
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
