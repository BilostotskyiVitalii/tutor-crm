import type { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Spin } from 'antd';

import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useAppSelector } from '@/store/reduxHooks';

interface AuthRouteProps {
  requireAuth: boolean;
  redirectPath?: string;
}

export const AuthRoute: FC<AuthRouteProps & { children: ReactNode }> = ({
  children,
  requireAuth,
  redirectPath,
}) => {
  const { email, loading } = useAppSelector((s) => s.user);
  const location = useLocation();

  if (loading) {
    return <Spin size="large" fullscreen />;
  }

  const isAuth = !!email;

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
