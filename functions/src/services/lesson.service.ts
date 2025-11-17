import { z } from 'zod';

import { admin } from '../firebase';
import { LessonRepo } from '../repos/lesson.repo';
import { lessonCreateSchema, lessonUpdateSchema } from '../schemas/lessons.schema';
import { AuthenticatedRequest } from '../types/authTypes';
import { Lesson, LessonData } from '../types/lessonTypes';
import { toISOString } from '../utils/toIsoString';
import { toTimestamp } from '../utils/toTimestamp';

export const LessonService = {
  create: async (
    payload: z.infer<typeof lessonCreateSchema>,
    req: AuthenticatedRequest,
  ): Promise<Lesson> => {
    const parsed = lessonCreateSchema.parse(payload);
    const now = admin.firestore.Timestamp.now();

    const docRef = await LessonRepo.create(req.user.uid, {
      ...parsed,
      start: toTimestamp(parsed.start),
      end: toTimestamp(parsed.end),
      createdAt: now,
      updatedAt: now,
    });

    const saved = await docRef.get();
    return toISOString({ id: docRef.id, ...(saved.data() as LessonData) });
  },

  update: async (
    id: string,
    payload: z.infer<typeof lessonUpdateSchema>,
    req: AuthenticatedRequest,
  ): Promise<Lesson> => {
    const parsed = lessonUpdateSchema.parse(payload);

    const toUpdate: Record<string, unknown> = {
      ...parsed,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    if (parsed.start) {
      toUpdate.start = toTimestamp(parsed.start);
    }
    if (parsed.end) {
      toUpdate.end = toTimestamp(parsed.end);
    }

    await LessonRepo.update(req.user.uid, id, toUpdate);

    const fresh = await LessonRepo.getById(req.user.uid, id);

    if (!fresh) {
      throw new Error('Not found');
    }

    return toISOString(fresh);
  },

  getAll: async (req: AuthenticatedRequest): Promise<Lesson[]> => {
    const lessons = await LessonRepo.getAll(req.user.uid);
    return lessons.map((l) => toISOString(l));
  },

  getById: async (id: string, req: AuthenticatedRequest): Promise<Lesson> => {
    const lesson = await LessonRepo.getById(req.user.uid, id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return toISOString(lesson);
  },

  delete: async (id: string, req: AuthenticatedRequest): Promise<void> => {
    await LessonRepo.delete(req.user.uid, id);
  },
};
