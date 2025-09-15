import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { navigationUrls } from '@/constants/navigationUrls';

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to={navigationUrls.login} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
