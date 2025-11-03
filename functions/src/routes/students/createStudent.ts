import { Request, Response } from 'express';
import { z } from 'zod';

import { admin, db } from '../../firebase';
import { AuthenticatedRequest } from '../../types/auth';
import { toTimestamp } from '../../utils/toTimestamp';

const createSchema = z.object({
  name: z.string().min(1),
  email: z.email().nullable().default(null),
  phone: z.string().optional().nullable().default(null),
  contact: z.string().optional().nullable().default(null),
  birthdate: z.union([z.number(), z.string(), z.null()]).optional().default(null),
  currentLevel: z.string().optional().nullable().default(null),
  price: z.number().nonnegative().default(0),
  notes: z.string().optional().nullable().default(null),
  avatarUrl: z.url().optional().nullable().default(null),
  isActive: z.boolean().optional().default(true),
});

const FieldValue = admin.firestore.FieldValue;

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const parsed = createSchema.parse(req.body ?? {});
    const now = FieldValue.serverTimestamp();

    const payload: Record<string, unknown> = {
      ...parsed,
      createdAt: now,
      updatedAt: now,
      birthdate: parsed.birthdate ? toTimestamp(parsed.birthdate) : null,
    };

    const ref = await db.collection(`users/${uid}/students`).add(payload);
    const saved = await ref.get();
    return res.status(201).json({ id: ref.id, ...saved.data() });
  } catch (err: unknown) {
    const isZod = err instanceof z.ZodError;
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(isZod ? 400 : 401).json({ message });
  }
};
