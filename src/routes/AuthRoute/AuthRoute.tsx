import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { navigationUrls } from '@/constants/navigationUrls';

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
  const { isAuth } = useAuth();

  if (requireAuth && !isAuth) {
    return <Navigate to={redirectPath ?? navigationUrls.login} replace />;
  }

  if (!requireAuth && isAuth) {
    return <Navigate to={redirectPath ?? navigationUrls.index} replace />;
  }

  return <>{children}</>;
};
