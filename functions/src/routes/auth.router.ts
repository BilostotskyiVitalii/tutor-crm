import crypto from 'crypto';

import { Request, Response, Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

import { admin, db } from '../firebase';
import { requireAuth } from '../middleware/requireAuth';

export const authRouter = Router();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OAUTH_REDIRECT_URI,
  JWT_SECRET,
  FRONTEND_ORIGIN = 'http://localhost:5173',
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
    });

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY is not set');
    }

    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );

    const data = (await r.json()) as FirebaseLoginResponse;

    if (!r.ok) {
      throw new Error(data.error?.message || 'Registration failed');
    }

    res.status(201).json({
      id: user.uid,
      email: user.email,
      nickName,
      token: data.idToken,
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
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY is not set');
    }

    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );
    const data = (await r.json()) as {
      localId?: string;
      email?: string;
      error?: { message: string };
    };
    if (!r.ok || !data.localId) {
      throw new Error(data.error?.message || 'Login failed');
    }

    const uid = data.localId;

    const userRef = db.collection('users').doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      await userRef.set({ email, createdAt: FieldValue.serverTimestamp(), provider: 'password' });
    } else {
      await userRef.update({ email, updatedAt: FieldValue.serverTimestamp() });
    }

    const ourJwt = jwt.sign({ uid, email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.cookie('auth', ourJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.json({ id: uid, email });
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

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: OAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      throw new Error(`Token exchange failed: ${t}`);
    }

    const tokens = (await tokenRes.json()) as {
      id_token: string;
      access_token: string;
      expires_in: number;
      refresh_token?: string;
      scope: string;
      token_type: string;
    };

    const ticket = await oAuthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Empty id_token payload');
    }

    const { sub: googleSub, email, name, picture, email_verified } = payload;

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
        emailVerified: !!email_verified,
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
        emailVerified: !!email_verified,
        createdAt: FieldValue.serverTimestamp(),
        provider: 'google',
      });
    } else {
      await userRef.update({
        email,
        nickName: name ?? null,
        avatar: picture ?? null,
        emailVerified: !!email_verified,
        updatedAt: FieldValue.serverTimestamp(),
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

    res.redirect(FRONTEND_ORIGIN);
  } catch (err) {
    res.status(400).send('OAuth error: ' + (err instanceof Error ? err.message : 'unknown'));
  }
});

// ------------------- LOGOUT -------------------

authRouter.post('/logout', (_req, res) => {
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
  const { uid } = (req as import('../types/auth').AuthenticatedRequest).user;
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json({ id: uid, ...snap.data() });
});
