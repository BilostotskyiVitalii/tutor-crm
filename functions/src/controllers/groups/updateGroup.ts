import { Request, Response } from 'express';
import { z, ZodError } from 'zod';

import { admin, db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/authTypes';

const FieldValue = admin.firestore.FieldValue;

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  studentIds: z.array(z.string()).optional(),
  notes: z.string().nullable().optional(),
  price: z.number().nonnegative().optional(),
});

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const updates = updateSchema.parse(req.body ?? {});
    const ref = db.doc(`users/${uid}/groups/${req.params.id}`);

    await ref.update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
    const fresh = await ref.get();
    res.json({ id: fresh.id, ...fresh.data() });
  } catch (err: unknown) {
    const code = err instanceof ZodError ? 400 : 401;
    const message = err instanceof Error ? err.message : 'Unexpected error';
    res.status(code).json({ message });
  }
};
