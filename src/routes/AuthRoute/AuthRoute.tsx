import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router';
import { navigationUrls } from '@/constants/navigationUrls';
import { useAuthProfile } from '@/hooks/useAuthProfile';

interface AuthRouteProps {
  children: ReactNode;
  requireAuth: boolean;
  redirectPath?: string;
}

export const AuthRoute: FC<AuthRouteProps> = ({
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
