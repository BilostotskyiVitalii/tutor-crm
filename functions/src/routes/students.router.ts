import { Request, Response, Router } from 'express';
import { z } from 'zod';

import { admin, db } from '../firebase';
import { extractUidFromBearer } from '../utils/auth';
import { toTimestamp } from '../utils/toTimestamp';
// import { toNullable } from '../utils/toNullable';

const FieldValue = admin.firestore.FieldValue;
export const studentsRouter = Router();

// --------------------
// 🔹 SCHEMAS
// --------------------
const createSchema = z.object({
  name: z.string().min(1),
  // email: toNullable(z.email()).default(null),
  email: z.email().nullable().default(null),
  phone: z.string().optional().nullable().default(null),
  contact: z.string().optional().nullable().default(null),
  birthdate: z
    .union([z.number(), z.string(), z.null()])
    .optional()
    .default(null),
  currentLevel: z.string().optional().nullable().default(null),
  price: z.number().nonnegative().default(0),
  notes: z.string().optional().nullable().default(null),
  avatarUrl: z.url().optional().nullable().default(null),
  isActive: z.boolean().optional().default(true),
});

const updateSchema = createSchema.partial();

// --------------------
// 🔹 ROUTES
// --------------------

// GET /students
studentsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
    const snap = await db.collection(`users/${uid}/students`).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.json(items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
});

// GET /students/:id
studentsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
    const ref = db.doc(`users/${uid}/students/${req.params.id}`);
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

// POST /students
studentsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
    const parsed = createSchema.parse(req.body ?? {});
    const now = FieldValue.serverTimestamp();

    const payload: Record<string, unknown> = {
      ...parsed,
      createdAt: now,
      updatedAt: now,
    };

    if ('birthdate' in parsed) {
      payload.birthdate = toTimestamp(parsed.birthdate);
    }

    const ref = await db.collection(`users/${uid}/students`).add(payload);
    const saved = await ref.get();
    return res.status(201).json({ id: ref.id, ...saved.data() });
  } catch (err: unknown) {
    const isZod = err instanceof z.ZodError;
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(isZod ? 400 : 401).json({ message });
  }
});

// PATCH /students/:id
studentsRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
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
});

// DELETE /students/:id
studentsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const uid = await extractUidFromBearer(req);
    await db.doc(`users/${uid}/students/${req.params.id}`).delete();
    return res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ message });
  }
});
