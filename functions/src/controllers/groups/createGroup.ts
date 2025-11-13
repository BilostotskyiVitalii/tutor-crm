import { Request, Response } from 'express';
import { z, ZodError } from 'zod';

import { admin, db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/authTypes';

const FieldValue = admin.firestore.FieldValue;

const createSchema = z.object({
  title: z.string().min(1),
  studentIds: z.array(z.string()).default([]),
  notes: z.string().nullable().optional().default(null),
  price: z.number().nonnegative().default(0),
});

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const parsed = createSchema.parse(req.body ?? {});

    const now = FieldValue.serverTimestamp();
    const ref = await db.collection(`users/${uid}/groups`).add({
      ...parsed,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await ref.get();
    res.status(201).json({ id: ref.id, ...saved.data() });
  } catch (err: unknown) {
    const code = err instanceof ZodError ? 400 : 401;
    const message = err instanceof Error ? err.message : 'Unexpected error';
    res.status(code).json({ message });
  }
};
