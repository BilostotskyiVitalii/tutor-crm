import { Request, Response } from 'express';

import { AuthService } from '../../services/auth/auth.service';
import { AuthenticatedRequest } from '../../types/authTypes';

export const profile = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;

    const user = await AuthService.getUserById(uid);

    return res.json(user);
  } catch (err) {
    const message = (err as Error).message;
    return res.status(message === 'Not found' ? 404 : 400).json({ message });
  }
};
