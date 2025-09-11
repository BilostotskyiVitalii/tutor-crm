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
  return (
    <Content className={styles.content}>
      <Routes>
        <Route path={dashboard} element={<Dashboard />} />
        <Route path={students} element={<Students />} />
        <Route path={analytics} element={<Analytics />} />
        <Route path={calendar} element={<Calendar />} />
        <Route path={settings} element={<Settings />} />
        <Route path={index} element={<Navigate replace to={dashboard} />} />
      </Routes>
    </Content>
  );
};

export default AppRoutes;
