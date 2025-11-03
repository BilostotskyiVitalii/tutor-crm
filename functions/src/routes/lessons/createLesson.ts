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

const createSchema = z.object({
  groupId: z.string().nullable().default(null),
  students: z.array(studentShape).default([]),
  start: z.number().int(),
  end: z.number().int(),
  notes: z.string().nullable().default(null),
  price: z.number().nonnegative().default(0),
});

const FieldValue = admin.firestore.FieldValue;

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as AuthenticatedRequest).user;
    const parsed = createSchema.parse(req.body ?? {});
    const now = FieldValue.serverTimestamp();

    const ref = await db.collection(`users/${uid}/lessons`).add({
      ...parsed,
      start: parsed.start ? toTimestamp(parsed.start) : null,
      end: parsed.end ? toTimestamp(parsed.end) : null,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await ref.get();
    return res.status(201).json({ id: ref.id, ...saved.data() });
  } catch (err: unknown) {
    const code = err instanceof ZodError ? 400 : 401;
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return res.status(code).json({ message });
  }
};
