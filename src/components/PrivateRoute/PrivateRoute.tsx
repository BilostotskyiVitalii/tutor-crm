import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthListener } from '@/hooks/useAuthListener';
import { navigationUrls } from '@/constants/navigationUrls';

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuth } = useAuth();
  const { loading } = useAuthListener();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to={navigationUrls.login} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
