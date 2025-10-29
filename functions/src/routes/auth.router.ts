import { Request, Response, Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import fetch from 'node-fetch';

import { admin, db } from '../firebase';

export const authRouter = Router();

// ------------------- Типы для Firebase REST API -------------------

interface FirebaseLoginResponse {
  localId: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  email: string;
}

interface FirebaseResetPasswordResponse {
  email: string;
}

interface FirebaseErrorResponse {
  error: {
    message: string;
    code?: number;
  };
}

// ------------------- REGISTER -------------------
authRouter.post('/register', async (req: Request, res: Response) => {
  const { email, password, nickName } = req.body as {
    email: string;
    password: string;
    nickName: string;
  };
  try {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: nickName,
    });

    await db.collection('users').doc(user.uid).set({
      email,
      nickName,
      createdAt: FieldValue.serverTimestamp(),
    });

    const customToken = await admin.auth().createCustomToken(user.uid);
    res.status(201).json({ token: customToken, uid: user.uid, email: user.email });
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

    const data = (await r.json()) as FirebaseLoginResponse | FirebaseErrorResponse;

    if (!r.ok) {
      const errMsg = (data as FirebaseErrorResponse).error?.message || 'Login failed';
      throw new Error(errMsg);
    }

    const customToken = await admin
      .auth()
      .createCustomToken((data as FirebaseLoginResponse).localId);
    res.json({ token: customToken, uid: (data as FirebaseLoginResponse).localId, email });
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
        avatar: ticket.picture,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    const customToken = await admin.auth().createCustomToken(uid);
    res.json({ token: customToken, uid, email: ticket.email });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Google login failed';
    res.status(400).json({ message });
  }
});

// ------------------- PASSWORD RESET -------------------
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY is not set');
    }

    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: 'PASSWORD_RESET', email }),
      },
    );

    const data = (await r.json()) as FirebaseResetPasswordResponse | FirebaseErrorResponse;

    if (!r.ok) {
      const errMsg = (data as FirebaseErrorResponse).error?.message || 'Reset password failed';
      throw new Error(errMsg);
    }

    res.json({ message: 'Reset email sent' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Reset password failed';
    res.status(400).json({ message });
  }
});
