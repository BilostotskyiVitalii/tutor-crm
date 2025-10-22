import z from 'zod';

export const toNullable = <T extends z.ZodTypeAny>(schema: T) =>
  schema
    .optional()
    .nullable()
    .transform((v) => (v === '' || v === undefined ? null : v));
