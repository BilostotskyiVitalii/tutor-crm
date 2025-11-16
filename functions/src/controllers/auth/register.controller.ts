import { Request, Response } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import jwt from 'jsonwebtoken';

import { admin, db } from '../../firebase';
import { axsAuth } from '../../utils/axsAuth';

const { JWT_SECRET } = process.env;

export const register = async (req: Request, res: Response) => {
  const { email, password, nickName } = req.body;

  try {
    const user = await admin.auth().createUser({ email, password, displayName: nickName });

    await db.collection('users').doc(user.uid).set({
      email,
      nickName,
      createdAt: FieldValue.serverTimestamp(),
      provider: 'email',
      avatar: null,
    });

    await axsAuth.post('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true,
    });

    const ourJwt = jwt.sign({ uid: user.uid, email }, JWT_SECRET!, { expiresIn: '7d' });

    res.cookie('auth', ourJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.status(201).json({ id: user.uid, email, nickName, avatar: null });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
