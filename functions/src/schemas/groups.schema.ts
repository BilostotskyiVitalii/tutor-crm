import { z } from 'zod';

export const groupCreateSchema = z.object({
  title: z.string().min(1),
  studentIds: z.array(z.string()).default([]),
  notes: z.string().nullable().default(null),
  price: z.number().nonnegative().default(0),
});

export const groupUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  studentIds: z.array(z.string()).optional(),
  notes: z.string().nullable().optional(),
  price: z.number().nonnegative().optional(),
});
