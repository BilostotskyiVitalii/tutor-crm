import type { FC } from 'react';
import { Route, Routes } from 'react-router';

import { LoginPage, RegistrationPage } from '@/pages';
import { WorkPlaceComponent, CustomSpinner } from '@/components';
import { AuthRoute } from '@/routes/AuthRoute/AuthRoute';

import { navigationUrls } from '@/constants/navigationUrls';
import { useAuthProfile } from '@/hooks/useAuthProfile';

const App: FC = () => {
  const { loading } = useAuthProfile();

  if (loading) {
    return <CustomSpinner />;
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
