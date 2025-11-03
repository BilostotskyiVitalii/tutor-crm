import { Request, Response } from 'express';

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('auth', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  res.status(204).end();
};
