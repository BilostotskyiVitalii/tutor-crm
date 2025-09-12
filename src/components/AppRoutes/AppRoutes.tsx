import { type FC } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Layout } from 'antd';

import { Analytics, Calendar, Dashboard, Settings, Students } from '@/pages';
import { navigationUrls } from '@/constants/navigationUrls';

import styles from './AppRoutes.module.scss';

const { Content } = Layout;
const { dashboard, students, calendar, settings, analytics, index } =
  navigationUrls;

const AppRoutes: FC = () => {
  const routes = [
    { path: dashboard, element: <Dashboard /> },
    { path: students, element: <Students /> },
    { path: calendar, element: <Calendar /> },
    { path: analytics, element: <Analytics /> },
    { path: settings, element: <Settings /> },
  ];

  return (
    <Content className={styles.content}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* "/" → dashboard */}
        <Route
          path={index}
          element={<Navigate to={navigationUrls.dashboard} />}
        />

        {/* глобальный fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                routes.find(({ path }) => location.pathname.startsWith(path))
                  ?.path ?? navigationUrls.dashboard
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
