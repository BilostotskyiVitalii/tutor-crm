import { Router } from 'express';

import { googleAuth, googleCallback } from '../controllers/auth/googleAuth.controller';
import { login } from '../controllers/auth/login.controller';
import { logout } from '../controllers/auth/logout.controller';
import { profile } from '../controllers/auth/profile.controller';
import { register } from '../controllers/auth/register.controller';
import { reset, resetConfirm } from '../controllers/auth/resetPassword.controller';
import { requireAuth } from '../middleware/requireAuth';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/google/url', googleAuth);
authRouter.get('/google/callback', googleCallback);
authRouter.post('/logout', requireAuth, logout);
authRouter.get('/profile', requireAuth, profile);
authRouter.post('/reset', reset);
authRouter.post('/reset/confirm', resetConfirm);
