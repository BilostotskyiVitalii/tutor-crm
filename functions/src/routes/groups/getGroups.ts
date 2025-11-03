import { Request, Response } from 'express';

import { db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/auth';

export const getGroups = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const snap = await db.collection(`users/${uid}/groups`).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    res.status(401).json({ message });
  }
};
