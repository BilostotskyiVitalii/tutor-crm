import type { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Spin } from 'antd';

import { useFetchProfileQuery } from '@/features/auth/api/authApi';
import { navigationUrls } from '@/shared/constants/navigationUrls';

interface AuthRouteProps {
  requireAuth: boolean;
  redirectPath?: string;
}

export const AuthRoute: FC<AuthRouteProps & { children: ReactNode }> = ({
  children,
  requireAuth,
  redirectPath,
}) => {
  const { data: user, isLoading } = useFetchProfileQuery();
  const location = useLocation();

  if (isLoading) {
    return <Spin size="large" fullscreen />;
  }

  const isAuth = !!user?.email;

  if (requireAuth && !isAuth) {
    return (
      <Navigate
        to={redirectPath ?? navigationUrls.login}
        replace
        state={{ from: location }}
      />
    );
  }

  if (!requireAuth && isAuth) {
    return <Navigate to={redirectPath ?? navigationUrls.index} replace />;
  }

  return children;
};
