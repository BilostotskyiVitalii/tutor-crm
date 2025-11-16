import { z } from 'zod';

export const studentCreateSchema = z.object({
  name: z.string().min(1),
  email: z.email().nullable().default(null),
  phone: z.string().nullable().default(null),
  contact: z.string().nullable().default(null),
  birthdate: z.union([z.number(), z.string(), z.null()]).default(null),
  currentLevel: z.string().nullable().default(null),
  price: z.number().nonnegative().default(0),
  notes: z.string().nullable().default(null),
  avatarUrl: z.url().nullable().default(null),
  isActive: z.boolean().default(true),
});

export const studentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().nullable().optional(),
  phone: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  birthdate: z.union([z.number(), z.string(), z.null()]).optional(),
  currentLevel: z.string().nullable().optional(),
  price: z.number().nonnegative().optional(),
  notes: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
});
