import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { navigationUrls } from '@/constants/navigationUrls';
import { CustomSpinner } from '@/components';
import type { IAuthRouteProps } from '@/types/routeTypes';
import { useAppSelector } from '@/hooks/reduxHooks';

export const AuthRoute: FC<IAuthRouteProps & { children: ReactNode }> = ({
  children,
  requireAuth,
  redirectPath,
}) => {
  const email = useAppSelector((state) => state.user.email);
  const loading = useAppSelector((state) => state.user.loading);

  if (loading) {
    return <CustomSpinner />;
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
