import { Request, Response } from 'express';

import { db } from '../firebase';
import { AuthenticatedRequest } from '../types/authTypes';
import { EntitiesType } from '../types/entitiesType';

export const getEntities = (type: EntitiesType) => async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const snap = await db.collection(`users/${uid}/${type}`).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.json(items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
};
