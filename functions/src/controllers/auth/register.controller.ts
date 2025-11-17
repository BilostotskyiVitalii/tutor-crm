import { Request, Response } from 'express';

import { AuthService } from '../../services/auth/auth.service';
import { EmailAuthService } from '../../services/auth/emailAuth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, nickName } = req.body;

    const { user, jwt } = await EmailAuthService.register(email, password, nickName);

    AuthService.setAuthCookie(res, jwt);

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
