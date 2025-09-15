import { type FC } from 'react';
import { Route, Routes } from 'react-router';

import { LoginPage, RegistrationPage } from '@/pages';
import { PrivateRoute, WorkPlaceComponent } from '@/components';
import { navigationUrls } from '@/constants/navigationUrls';
import { useAuthListener } from '@/hooks/useAuthListener';

const App: FC = () => {
  useAuthListener();

  return (
    <Routes>
      <Route path={navigationUrls.login} element={<LoginPage />} />
      <Route
        path={navigationUrls.registration}
        element={<RegistrationPage />}
      />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <WorkPlaceComponent />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
