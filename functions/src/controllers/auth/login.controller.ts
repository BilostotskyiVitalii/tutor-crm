import { Request, Response } from 'express';

import { AuthService } from '../../services/auth/auth.service';
import { EmailAuthService } from '../../services/auth/emailAuth.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { jwt, uid } = await EmailAuthService.login(email, password);

    AuthService.setAuthCookie(res, jwt);

    res.json({ id: uid, email });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
