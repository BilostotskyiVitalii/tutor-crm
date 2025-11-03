import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuth';

import { googleAuth, googleCallback } from './auth/googleAuth';
import { login } from './auth/login';
import { logout } from './auth/logout';
import { profile } from './auth/profile';
import { register } from './auth/register';
import { reset, resetConfirm } from './auth/resetPassword';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/google/url', googleAuth);
authRouter.get('/google/callback', googleCallback);
authRouter.post('/logout', requireAuth, logout);
authRouter.get('/profile', requireAuth, profile);
authRouter.post('/reset', reset);
authRouter.post('/reset/confirm', resetConfirm);
