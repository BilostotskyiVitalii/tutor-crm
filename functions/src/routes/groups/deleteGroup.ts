import { Request, Response } from 'express';

import { db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/auth';

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    await db.doc(`users/${uid}/groups/${req.params.id}`).delete();
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    res.status(401).json({ message });
  }
};
