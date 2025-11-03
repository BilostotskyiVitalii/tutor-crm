import { Request, Response } from 'express';
import { z, ZodError } from 'zod';

import { admin, db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/auth';
import { toTimestamp } from '../../utils/toTimestamp';

const studentShape = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().default(''),
});

const updateSchema = z.object({
  groupId: z.string().nullable().optional().nullable(),
  students: z.array(studentShape).optional().nullable(),
  start: z.number().int().optional().nullable(),
  end: z.number().int().optional().nullable(),
  notes: z.string().nullable().optional().nullable(),
  price: z.number().nonnegative().optional().nullable(),
});

const FieldValue = admin.firestore.FieldValue;

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const updates = updateSchema.parse(req.body ?? {});
    const ref = db.doc(`users/${uid}/lessons/${req.params.id}`);
    const now = FieldValue.serverTimestamp();

    const toUpdate: Record<string, unknown> = {
      ...updates,
      updatedAt: now,
    };

    (['start', 'end'] as (keyof typeof updates)[]).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        toUpdate[key] = toTimestamp(updates[key]);
      }
    });

    await ref.update(toUpdate);
    const fresh = await ref.get();
    return res.json({ id: fresh.id, ...fresh.data() });
  } catch (err: unknown) {
    const code = err instanceof ZodError ? 400 : 401;
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return res.status(code).json({ message });
  }
};
