import { Router } from 'express';

import { googleAuth, googleCallback } from '../controllers/auth/googleAuth';
import { login } from '../controllers/auth/login';
import { logout } from '../controllers/auth/logout';
import { profile } from '../controllers/auth/profile';
import { register } from '../controllers/auth/register';
import { reset, resetConfirm } from '../controllers/auth/resetPassword';
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
