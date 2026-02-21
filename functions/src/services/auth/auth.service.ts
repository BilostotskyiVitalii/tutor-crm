import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../config';
import { db } from '../../firebase';

export const AuthService = {
  createJwt(uid: string, email: string) {
    const secret = JWT_SECRET.value();
    return jwt.sign({ uid, email }, secret, { expiresIn: '7d' });
  },

  setAuthCookie(res: Response, jwtToken: string) {
    res.cookie('auth', jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 3600 * 1000, // 7 дней
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
