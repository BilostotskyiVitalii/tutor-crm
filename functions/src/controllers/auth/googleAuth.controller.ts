import { Request, Response } from 'express';

import { FRONTEND_ORIGIN } from '../../config';
import { AuthService } from '../../services/auth/auth.service';
import { GoogleAuthService } from '../../services/auth/googleAuth.service';

export const googleAuth = (req: Request, res: Response) => {
  const url = GoogleAuthService.generateAuthUrl();
  res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).send('Missing code');
    }

    const { jwt } = await GoogleAuthService.handleCallback(code);

    AuthService.setAuthCookie(res, jwt);

    const frontendOrigin = FRONTEND_ORIGIN.value();
    return res.redirect(`${frontendOrigin}/dashboard`);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Google OAuth failed';
    res.status(400).send(message);
  }
};
