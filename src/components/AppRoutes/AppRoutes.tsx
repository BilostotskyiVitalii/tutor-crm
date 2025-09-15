import { type FC } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Layout } from 'antd';

import {
  Analytics,
  Calendar,
  Dashboard,
  Settings,
  StudentPage,
  Students,
} from '@/pages';
import { navigationUrls } from '@/constants/navigationUrls';

import styles from './AppRoutes.module.scss';

const { Content } = Layout;
const { dashboard, students, student, calendar, settings, analytics, index } =
  navigationUrls;

const AppRoutes: FC = () => {
  const routes = [
    { path: dashboard, element: <Dashboard /> },
    { path: students, element: <Students /> },
    { path: calendar, element: <Calendar /> },
    { path: analytics, element: <Analytics /> },
    { path: settings, element: <Settings /> },
    { path: student, element: <StudentPage /> },
  ];

  return (
    <Content className={styles.content}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path={index} element={<Navigate to={dashboard} />} />
        <Route
          path="*"
          element={
            <Navigate
              to={
                routes.find(({ path }) => location.pathname.startsWith(path))
                  ?.path ?? dashboard
              }
              replace
            />
          }
        />
      </Routes>
    </Content>
  );
};

export default AppRoutes;
