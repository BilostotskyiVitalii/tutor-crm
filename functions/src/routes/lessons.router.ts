import { Request, Response, Router } from 'express';
import { z, ZodError } from 'zod';

import { admin, db } from '../firebase';
import { extractUidFromBearer } from '../utils/auth';
import { toTimestamp } from '../utils/toTimestamp';

const FieldValue = admin.firestore.FieldValue;
export const lessonsRouter = Router();

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

const updateSchema = z.object({
  groupId: z.string().nullable().optional().nullable(),
  students: z.array(studentShape).optional().nullable(),
  start: z.number().int().optional().nullable(),
  end: z.number().int().optional().nullable(),
  notes: z.string().nullable().optional().nullable(),
  price: z.number().nonnegative().optional().nullable(),
});

// ---------- GET /lessons ----------
lessonsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
    const snap = await db.collection(`users/${uid}/lessons`).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.json(items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
});

// ---------- GET /lessons/:id ----------
lessonsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
    const ref = db.doc(`users/${uid}/lessons/${req.params.id}`);
    const snap = await ref.get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.json({ id: snap.id, ...snap.data() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
});

// ---------- POST /lessons ----------
lessonsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
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
});

// ---------- PATCH /lessons/:id ----------
lessonsRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
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
});

// ---------- DELETE /lessons/:id ----------
lessonsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
    await db.doc(`users/${uid}/lessons/${req.params.id}`).delete();
    return res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
});
