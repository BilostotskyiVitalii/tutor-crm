import type { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { navigationUrls } from '@/constants/navigationUrls';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import type { IAuthRouteProps } from '@/types/routeTypes';

export const AuthRoute: FC<IAuthRouteProps> = ({
  children,
  requireAuth,
  redirectPath,
}) => {
  const { isAuth } = useAuthProfile();

  if (requireAuth && !isAuth) {
    return <Navigate to={redirectPath ?? navigationUrls.login} replace />;
  }

  if (!requireAuth && isAuth) {
    return <Navigate to={redirectPath ?? navigationUrls.index} replace />;
  }

  return <>{children}</>;
};
