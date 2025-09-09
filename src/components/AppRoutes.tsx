import type { FC } from 'react';
import { Route, Routes } from 'react-router';
import Dashboard from '../pages/Dashboard.tsx/Dashboard';

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;
