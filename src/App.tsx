import type { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { WorkPlaceComponent } from '@/components';
import { navigationUrls } from '@/constants/navigationUrls';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { ForgotPasswordPage, LoginPage, RegistrationPage } from '@/pages';
import { AuthRoute } from '@/routes/AuthRoute/AuthRoute';

const App: FC = () => {
  useAuthProfile();

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
        path={navigationUrls.forgotPassword}
        element={
          <AuthRoute requireAuth={false}>
            <ForgotPasswordPage />
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
