import axios from 'axios';
import { Request, Response } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { admin, db } from '../../firebase';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OAUTH_REDIRECT_URI, JWT_SECRET, FRONTEND_ORIGIN } =
  process.env;

const oAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleAuth = (_req: Request, res: Response) => {
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
};

export const googleCallback = async (req: Request, res: Response) => {
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
};
