import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthenticatedRequest, AuthUser } from '../types/auth';

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): asserts req is AuthenticatedRequest {
  const token =
    req.cookies?.auth ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
