import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { db } from '../../firebase';
import { axsAuth } from '../../utils/axsAuth';

const { JWT_SECRET } = process.env;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { data } = await axsAuth.post('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true,
    });

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
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
