import { type FC } from 'react';
import { Route, Routes } from 'react-router';

import { LoginPage, RegistrationPage } from '@/pages';
import { WorkPlaceComponent } from '@/components';
import { navigationUrls } from '@/constants/navigationUrls';

const App: FC = () => {
  return (
    <Routes>
      <Route path={navigationUrls.login} element={<LoginPage />} />
      <Route
        path={navigationUrls.registration}
        element={<RegistrationPage />}
      />
      <Route path="/*" element={<WorkPlaceComponent />} />
    </Routes>
  );
};

export default App;
