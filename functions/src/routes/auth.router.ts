import crypto from 'crypto';

import axios from 'axios';
import { Request, Response, Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { admin, db } from '../firebase';
import { requireAuth } from '../middleware/requireAuth';
import { AuthenticatedRequest } from '../types/auth';
import { axsAuth } from '../utils/axsAuth';
import { sendEmail } from '../utils/sendEmail';

export const authRouter = Router();

const {
  API_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OAUTH_REDIRECT_URI,
  JWT_SECRET,
  FRONTEND_ORIGIN,
  FRONTEND_RESET_PASSWORD_URL,
} = process.env;

const oAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

interface FirebaseLoginResponse {
  idToken: string;
  localId: string;
  email?: string;
  refreshToken?: string;
  expiresIn?: string;
  error?: { message: string };
}

// ------------------- REGISTER -------------------
authRouter.post('/register', async (req: Request, res: Response) => {
  const { email, password, nickName } = req.body as {
    email: string;
    password: string;
    nickName: string;
  };

  try {
    const user = await admin.auth().createUser({ email, password, displayName: nickName });

    await db.collection('users').doc(user.uid).set({
      email,
      nickName,
      createdAt: FieldValue.serverTimestamp(),
      provider: 'email',
      avatar: null,
    });

    const { data } = await axsAuth.post<FirebaseLoginResponse>('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true,
    });

    if (!data.localId) {
      throw new Error(data.error?.message || 'Registration failed');
    }

    const ourJwt = jwt.sign({ uid: user.uid, email }, JWT_SECRET!, { expiresIn: '7d' });

    res.cookie('auth', ourJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 3600 * 1000,
      path: '/',
    });

    res.status(201).json({
      id: user.uid,
      email: user.email,
      nickName,
      avatar: null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    res.status(400).json({ message });
  }
});

// ------------------- LOGIN -------------------
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const { data } = await axsAuth.post<FirebaseLoginResponse>('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true,
    });

    if (!data.localId) {
      throw new Error(data.error?.message || 'Login failed');
    }

    const uid = data.localId;
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    const ourJwt = jwt.sign({ uid, email }, JWT_SECRET!, { expiresIn: '7d' });

    res.cookie('auth', ourJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.status(200).json({
      id: uid,
      email,
      nickName: userData?.nickName || 'UserName',
      avatar: userData?.avatar || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    res.status(400).json({ message });
  }
});

// ------------------- GOOGLE LOGIN -------------------

authRouter.get('/google/url', (_req: Request, res: Response) => {
  if (!GOOGLE_CLIENT_ID || !OAUTH_REDIRECT_URI) {
    return res.status(500).json({ message: 'OAuth env vars are missing' });
  }

  const state = crypto.randomUUID();
  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
  });

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', OAUTH_REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);

  return res.redirect(url.toString());
});

authRouter.get('/google/callback', async (req: Request, res: Response) => {
  try {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !OAUTH_REDIRECT_URI || !JWT_SECRET) {
      throw new Error('OAuth env vars are missing');
    }

    const { code, state } = req.query as { code?: string; state?: string };
    const cookieState = req.cookies?.['oauth_state'];

    if (!code) {
      throw new Error('Missing "code"');
    }
    if (!state || !cookieState || state !== cookieState) {
      throw new Error('Invalid state');
    }

    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: OAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const { id_token } = tokenRes.data;

    const ticket = await oAuthClient.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Empty id_token payload');
    }

    const { sub: googleSub, email, name, picture } = payload;

    if (!googleSub || !email) {
      throw new Error('No sub/email in id_token');
    }

    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch {
      userRecord = await admin.auth().createUser({
        email,
        displayName: name ?? undefined,
        photoURL: picture ?? undefined,
      });
    }

    const uid = userRecord.uid;
    const userRef = db.collection('users').doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      await userRef.set({
        email,
        nickName: name ?? null,
        avatar: picture ?? null,
        createdAt: FieldValue.serverTimestamp(),
        provider: 'google',
      });
    } else {
      await userRef.update({
        email,
        nickName: name ?? null,
        avatar: picture ?? null,
      });
    }

    const ourJwt = jwt.sign({ uid, email }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('auth', ourJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 3600 * 1000,
      path: '/',
    });

    res.clearCookie('oauth_state');

    res.redirect(FRONTEND_ORIGIN as string);
  } catch (err) {
    res.status(400).send('OAuth error: ' + (err instanceof Error ? err.message : 'unknown'));
  }
});

// ------------------- LOGOUT -------------------

authRouter.post('/logout', requireAuth, (_req, res) => {
  res.clearCookie('auth', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  res.status(204).end();
});

// ------------------- PROFILE -------------------

authRouter.get('/profile', requireAuth, async (req, res) => {
  const { uid } = (req as AuthenticatedRequest).user;
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json({ id: uid, ...snap.data() });
});

// --------------- RESET ------------------------

authRouter.post('/reset', async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: `${FRONTEND_RESET_PASSWORD_URL}?email=${email}`,
      handleCodeInApp: true,
    });

    const query = resetLink.split('?')[1];
    const customLink = `${FRONTEND_RESET_PASSWORD_URL}?${query}`;

    await sendEmail({
      to: email,
      subject: 'Tutor CRM - Password Reset',
      html: `<p>Click <a href="${customLink}">here</a> to reset your password</p>`,
    });

    return res.status(200).json({ message: 'Password reset link sent', resetLink });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send reset link';
    return res.status(400).json({ message });
  }
});

authRouter.post('/reset/confirm', async (req: Request, res: Response) => {
  const { oobCode, newPassword } = req.body as { oobCode: string; newPassword: string };

  if (!oobCode || !newPassword) {
    return res.status(400).json({ message: 'Missing oobCode or new password' });
  }

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${API_KEY}`,
      {
        oobCode,
        newPassword,
      },
    );

    return res.status(200).json({ success: true, email: response.data.email });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reset password';
    return res.status(400).json({ message });
  }
});
