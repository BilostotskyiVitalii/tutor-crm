import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { Spin } from 'antd';

import type { IAuthRouteProps } from '@/routes/routeTypes';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useAppSelector } from '@/store/reduxHooks';

export const AuthRoute: FC<IAuthRouteProps & { children: ReactNode }> = ({
  children,
  requireAuth,
  redirectPath,
}) => {
  const email = useAppSelector((state) => state.user.email);
  const loading = useAppSelector((state) => state.user.loading);

  if (loading) {
    return <Spin spinning={loading} fullscreen />;
  }

  const isAuth = !!email;

  if (requireAuth && !isAuth) {
    return <Navigate to={redirectPath ?? navigationUrls.login} replace />;
  }

  if (!requireAuth && isAuth) {
    return <Navigate to={redirectPath ?? navigationUrls.index} replace />;
  }

  return <>{children}</>;
};
