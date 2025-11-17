import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { db } from '../../firebase';

const { JWT_SECRET } = process.env;

export const AuthService = {
  createJwt(uid: string, email: string) {
    return jwt.sign({ uid, email }, JWT_SECRET!, { expiresIn: '7d' });
  },

  setAuthCookie(res: Response, jwtToken: string) {
    res.cookie('auth', jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 3600 * 1000,
    });
  },

  async getUserById(uid: string) {
    const doc = await db.collection('users').doc(uid).get();

    if (!doc.exists) {
      throw new Error('Not found');
    }

    return { id: uid, ...doc.data() };
  },
};
