import { Request, Response } from 'express';

import { db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/authTypes';

export const profile = async (req: Request, res: Response) => {
  const { uid } = (req as AuthenticatedRequest).user;
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json({ id: uid, ...snap.data() });
};
