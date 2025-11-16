import { z } from 'zod';

export const studentShape = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().default(''),
});

export const lessonCreateSchema = z.object({
  groupId: z.string().nullable().default(null),
  students: z.array(studentShape).default([]),
  start: z.number().int(),
  end: z.number().int(),
  notes: z.string().nullable().default(null),
  price: z.number().nonnegative().default(0),
});

export const lessonUpdateSchema = z.object({
  groupId: z.string().nullable().optional(),
  students: z.array(studentShape).nullable().optional(),
  start: z.number().int().nullable().optional(),
  end: z.number().int().nullable().optional(),
  notes: z.string().nullable().optional(),
  price: z.number().nonnegative().nullable().optional(),
});
