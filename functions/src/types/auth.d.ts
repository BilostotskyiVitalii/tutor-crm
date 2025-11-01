// types/auth.d.ts або поруч з middleware
import { Request } from 'express';

export interface AuthUser {
  uid: string;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser; // тут уже НЕ optional
}
