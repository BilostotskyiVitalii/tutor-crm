import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Spin } from 'antd';

import { AuthRoute } from '@/routes/AuthRoute/AuthRoute';
import { navigationUrls } from '@/shared/constants/navigationUrls';

const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage'));
const RegistrationPage = lazy(
  () => import('@/pages/RegistrationPage/RegistrationPage'),
);
const ForgotPasswordPage = lazy(
  () => import('@/pages/ForgotPasswordPage/ForgotPasswordPage'),
);

export const AuthRoutes = () => (
  <Suspense fallback={<Spin fullscreen />}>
    <Routes>
      <Route
        path={navigationUrls.login.replace('/auth', '')}
        element={
          <AuthRoute requireAuth={false}>
            <LoginPage />
          </AuthRoute>
        }
      />

      <Route
        path={navigationUrls.registration.replace('/auth', '')}
        element={
          <AuthRoute requireAuth={false}>
            <RegistrationPage />
          </AuthRoute>
        }
      />

      <Route
        path={navigationUrls.forgotPassword.replace('/auth', '')}
        element={
          <AuthRoute requireAuth={false}>
            <ForgotPasswordPage />
          </AuthRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate to={navigationUrls.login.replace('/auth', '')} replace />
        }
      />
    </Routes>
  </Suspense>
);
