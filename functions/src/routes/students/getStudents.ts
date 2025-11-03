import { Request, Response } from 'express';

import { db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/auth';

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const snap = await db.collection(`users/${uid}/students`).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.json(items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
};
