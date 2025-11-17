import { z } from 'zod';

import { admin } from '../firebase';
import { GroupRepo } from '../repos/group.repo';
import { groupCreateSchema } from '../schemas/groups.schema';
import { AuthenticatedRequest } from '../types/authTypes';
import { Group, GroupData } from '../types/groupTypes';
import { toISOString } from '../utils/toIsoString';

export const groupUpdateSchema = groupCreateSchema.partial();

export const GroupService = {
  create: async (
    payload: z.infer<typeof groupCreateSchema>,
    req: AuthenticatedRequest,
  ): Promise<Group> => {
    const parsed = groupCreateSchema.parse(payload);
    const now = admin.firestore.Timestamp.now();

    const docRef = await GroupRepo.create(req.user.uid, {
      ...parsed,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await docRef.get();
    if (!saved.exists) {
      throw new Error('Failed to create group');
    }

    return toISOString({ id: docRef.id, ...(saved.data() as GroupData) });
  },

  update: async (
    id: string,
    payload: z.infer<typeof groupUpdateSchema>,
    req: AuthenticatedRequest,
  ): Promise<Group> => {
    const parsed = groupUpdateSchema.parse(payload);

    const toUpdate: Partial<GroupData> = {
      ...parsed,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await GroupRepo.update(req.user.uid, id, toUpdate);

    const fresh = await GroupRepo.getById(req.user.uid, id);

    if (!fresh) {
      throw new Error('Not found');
    }

    return toISOString(fresh);
  },

  getAll: async (req: AuthenticatedRequest): Promise<Group[]> => {
    const groups = await GroupRepo.getAll(req.user.uid);
    return groups.map((g) => toISOString(g));
  },

  getById: async (id: string, req: AuthenticatedRequest): Promise<Group> => {
    const doc = await GroupRepo.getById(req.user.uid, id);
    if (!doc) {
      throw new Error('Not found');
    }
    return toISOString(doc);
  },

  delete: async (id: string, req: AuthenticatedRequest): Promise<void> => {
    await GroupRepo.delete(req.user.uid, id);
  },
};
