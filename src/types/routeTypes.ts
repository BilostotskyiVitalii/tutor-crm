import type { ReactNode } from 'react';

export interface IAuthRouteProps {
  children: ReactNode;
  requireAuth: boolean;
  redirectPath?: string;
}
