import type { FC } from 'react';
import { Route, Routes } from 'react-router';

import { LoginPage, RegistrationPage } from '@/pages';
import { WorkPlaceComponent } from '@/components';
import { AuthRoute } from '@/routes/AuthRoute/AuthRoute';

import { navigationUrls } from '@/constants/navigationUrls';
import { useAuthListener } from '@/hooks/useAuthListener';
import { Flex, Spin } from 'antd';

const App: FC = () => {
  const { loading } = useAuthListener();

  if (loading) {
    return (
      <Flex align="center" justify="center" gap="middle">
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Routes>
      <Route
        path={navigationUrls.login}
        element={
          <AuthRoute requireAuth={false}>
            <LoginPage />
          </AuthRoute>
        }
      />
      <Route
        path={navigationUrls.registration}
        element={
          <AuthRoute requireAuth={false}>
            <RegistrationPage />
          </AuthRoute>
        }
      />

      <Route
        path="/*"
        element={
          <AuthRoute requireAuth={true}>
            <WorkPlaceComponent />
          </AuthRoute>
        }
      />
    </Routes>
  );
};

export default App;
