import { Request, Response } from 'express';

import { db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/auth';

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    await db.doc(`users/${uid}/lessons/${req.params.id}`).delete();
    return res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
};
