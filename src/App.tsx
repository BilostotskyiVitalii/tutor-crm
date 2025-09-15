import { type FC } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { LoginPage, RegistrationPage } from '@/pages';
import { WorkPlaceComponent } from '@/components';
import { navigationUrls } from '@/constants/navigationUrls';
import { useAuthListener } from '@/hooks/useAuthListener';
import { useAuth } from '@/hooks/useAuth';

const App: FC = () => {
  const { isAuth } = useAuth();
  const { loading } = useAuthListener();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Routes>
      <Route
        path={navigationUrls.login}
        element={
          isAuth ? <Navigate to={navigationUrls.index} /> : <LoginPage />
        }
      />
      <Route
        path={navigationUrls.registration}
        element={
          isAuth ? <Navigate to={navigationUrls.index} /> : <RegistrationPage />
        }
      />

      <Route
        path="/*"
        element={
          !isAuth ? (
            <Navigate to={navigationUrls.login} />
          ) : (
            <WorkPlaceComponent />
          )
        }
      />
    </Routes>
  );
};

export default App;
