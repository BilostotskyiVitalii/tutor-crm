import { Request, Response, Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import fetch from 'node-fetch';

import { admin, db } from '../firebase';

export const authRouter = Router();

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

    const data = (await r.json()) as FirebaseLoginResponse;

    if (!r.ok) {
      throw new Error(data.error?.message || 'Login failed');
    }

    res.json({
      id: data.localId,
      email,
      token: data.idToken,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    res.status(400).json({ message });
  }
});

// ------------------- GOOGLE LOGIN -------------------
authRouter.post('/google', async (req: Request, res: Response) => {
  const { idToken } = req.body as { idToken: string };
  try {
    const ticket = await admin.auth().verifyIdToken(idToken);
    const uid = ticket.uid;

    const userRef = db.collection('users').doc(uid);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      await userRef.set({
        email: ticket.email,
        nickName: ticket.name,
        avatar: ticket.picture ?? null,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    res.json({
      id: uid,
      token: idToken,
      email: ticket.email,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Google login failed';
    res.status(400).json({ message });
  }
});

// ------------------- PROFILE -------------------
authRouter.get('/profile', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const userRef = db.collection('users').doc(uid);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      throw new Error('User not found');
    }

    const data = snapshot.data();
    res.json({
      id: uid,
      email: data?.email,
      nickName: data?.nickName,
      avatar: data?.avatar ?? null,
      createdAt: data?.createdAt?.toMillis() ?? Date.now(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch profile';
    res.status(401).json({ message });
  }
});
