import { Request, Response } from 'express';

import { db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/auth';

export const geetStudentById = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const ref = db.doc(`users/${uid}/students/${req.params.id}`);
    const snap = await ref.get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.json({ id: snap.id, ...snap.data() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
};
