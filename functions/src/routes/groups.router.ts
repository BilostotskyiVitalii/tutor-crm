import { Request, Response, Router } from 'express';
import { z, ZodError } from 'zod';

import { admin, db } from '../firebase';
import { requireAuth } from '../middleware/requireAuth';

const FieldValue = admin.firestore.FieldValue;

export const groupsRouter = Router();

const createSchema = z.object({
  title: z.string().min(1),
  studentIds: z.array(z.string()).default([]),
  notes: z.string().nullable().optional().default(null),
  price: z.number().nonnegative().default(0),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  studentIds: z.array(z.string()).optional(),
  notes: z.string().nullable().optional(),
  price: z.number().nonnegative().optional(),
});

// ===== GET all groups =====
groupsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { uid } = (req as import('../types/auth').AuthenticatedRequest).user;
    const snap = await db.collection(`users/${uid}/groups`).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    res.status(401).json({ message });
  }
});

// ===== CREATE group =====
groupsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { uid } = (req as import('../types/auth').AuthenticatedRequest).user;
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
});

// ===== GET one group =====
groupsRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { uid } = (req as import('../types/auth').AuthenticatedRequest).user;
    const ref = db.doc(`users/${uid}/groups/${req.params.id}`);
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

// ===== UPDATE group =====
groupsRouter.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { uid } = (req as import('../types/auth').AuthenticatedRequest).user;
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
});

// ===== DELETE group =====
groupsRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { uid } = (req as import('../types/auth').AuthenticatedRequest).user;
    await db.doc(`users/${uid}/groups/${req.params.id}`).delete();
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    res.status(401).json({ message });
  }
});
