import type { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useAuthProfile } from '@/features/user/hooks/useAuthProfile';
import { AuthRoute } from '@/routes/AuthRoute/AuthRoute';
import { AuthRoutes } from '@/routes/AuthRoutes/AuthRoutes';
import { MainLayout } from '@/shared/components/Layout/MainLayout/MainLayout';
import { AppModal } from '@/shared/components/UI/AppModal/AppModal';
import { ModalProvider } from '@/shared/providers/ModalProvider';

const App: FC = () => {
  useAuthProfile();

  return (
    <ModalProvider>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route
          path="/*"
          element={
            <AuthRoute requireAuth={true}>
              <MainLayout />
            </AuthRoute>
          }
        />
      </Routes>
      <AppModal />
    </ModalProvider>
  );
};

export default App;
