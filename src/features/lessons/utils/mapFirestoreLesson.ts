import { type DocumentData, Timestamp } from 'firebase/firestore';

import type { Lesson } from '@/features/lessons/types/lessonTypes';

const toMillisOrNull = (v: unknown): number | null =>
  (v as Timestamp)?.toMillis?.() ?? (typeof v === 'number' ? v : null);

const toMillisOrNumber = (v: unknown, fallback: number): number =>
  toMillisOrNull(v) ?? fallback;

export const mapFirestoreLesson = (id: string, data: DocumentData): Lesson => ({
  id,
  groupId: data.groupId ?? null,
  students: data.students ?? [],
  notes: data.notes ?? null,
  price: data.price ?? 0,
  start: toMillisOrNumber(data.start, Date.now()),
  end: toMillisOrNumber(data.end, Date.now()),
  createdAt: toMillisOrNumber(data.createdAt, Date.now()),
  updatedAt: toMillisOrNumber(data.updatedAt, Date.now()),
});
