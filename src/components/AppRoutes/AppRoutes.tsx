import type { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Layout, theme } from 'antd';

import { Analytics, Calendar, Dashboard, Settings, Students } from '@/pages';

const { Content } = Layout;

const AppRoutes: FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content
      style={{
        margin: '24px 16px 0',
        padding: 24,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
      </Routes>
    </Content>
  );
};

export default AppRoutes;
