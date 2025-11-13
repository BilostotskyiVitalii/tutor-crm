import { Request, Response } from 'express';
import { z } from 'zod';

import { admin, db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/authTypes';
import { toTimestamp } from '../../utils/toTimestamp';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional().nullable(),
  phone: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  birthdate: z.union([z.number(), z.string(), z.null()]).optional(),
  currentLevel: z.string().optional().nullable(),
  price: z.number().nonnegative().optional(),
  notes: z.string().optional().nullable(),
  avatarUrl: z.url().optional().nullable(),
  isActive: z.boolean().optional(),
});

const FieldValue = admin.firestore.FieldValue;

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const updates = updateSchema.parse(req.body ?? {});
    const ref = db.doc(`users/${uid}/students/${req.params.id}`);
    const now = FieldValue.serverTimestamp();

    const toUpdate: Record<string, unknown> = {
      ...updates,
      updatedAt: now,
    };

    if (Object.prototype.hasOwnProperty.call(updates, 'birthdate')) {
      toUpdate.birthdate = toTimestamp(updates.birthdate);
    }

    await ref.update(toUpdate);
    const fresh = await ref.get();
    return res.json({ id: fresh.id, ...fresh.data() });
  } catch (err: unknown) {
    const isZod = err instanceof z.ZodError;
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(isZod ? 400 : 401).json({ message });
  }
};
