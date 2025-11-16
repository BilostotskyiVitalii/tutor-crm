import { z } from 'zod';

import { admin } from '../firebase';
import { StudentRepo } from '../repos/student.repo';
import { studentCreateSchema, studentUpdateSchema } from '../schemas/students.schema';
import { AuthenticatedRequest } from '../types/authTypes';
import { Student, StudentData } from '../types/studentTypes';
import { toISOString } from '../utils/toIsoString';
import { toTimestamp } from '../utils/toTimestamp';

export const StudentService = {
  create: async (
    payload: z.infer<typeof studentCreateSchema>,
    req: AuthenticatedRequest,
  ): Promise<Student> => {
    const parsed = studentCreateSchema.parse(payload);
    const now = admin.firestore.Timestamp.now();

    const docRef = await StudentRepo.create(req.user.uid, {
      ...parsed,
      birthdate: parsed.birthdate ? toTimestamp(parsed.birthdate) : null,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await docRef.get();
    return toISOString({ id: docRef.id, ...(saved.data() as StudentData) });
  },

  update: async (
    id: string,
    payload: z.infer<typeof studentUpdateSchema>,
    req: AuthenticatedRequest,
  ): Promise<Student> => {
    const parsed = studentUpdateSchema.parse(payload);

    const toUpdate: Record<string, unknown> = {
      ...parsed,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    if ('birthdate' in parsed) {
      toUpdate.birthdate = parsed.birthdate ? toTimestamp(parsed.birthdate) : null;
    }

    await StudentRepo.update(req.user.uid, id, toUpdate);

    const fresh = await StudentRepo.getById(req.user.uid, id);
    if (!fresh) {
      throw new Error('Not found');
    }

    return toISOString(fresh);
  },

  getAll: async (req: AuthenticatedRequest): Promise<Student[]> => {
    const students = await StudentRepo.getAll(req.user.uid);
    return students.map((s) => toISOString(s));
  },

  getById: async (id: string, req: AuthenticatedRequest): Promise<Student> => {
    const student = await StudentRepo.getById(req.user.uid, id);
    if (!student) {
      throw new Error('Student not found');
    }
    return toISOString(student);
  },

  delete: async (id: string, req: AuthenticatedRequest): Promise<void> => {
    await StudentRepo.delete(req.user.uid, id);
  },
};
