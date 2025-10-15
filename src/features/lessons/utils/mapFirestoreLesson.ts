import { type DocumentData, Timestamp } from 'firebase/firestore';

import type { Lesson } from '@/features/lessons/types/lessonTypes';

export const mapFirestoreLesson = (id: string, data: DocumentData): Lesson => ({
  id,
  groupId: data.groupId ?? '',
  students: data.students ?? [],
  notes: data.notes ?? '',
  price: data.price ?? 0,
  start: (data.start as Timestamp)?.toMillis?.() ?? null,
  end: (data.end as Timestamp)?.toMillis?.() ?? null,
  createdAt: (data.createdAt as Timestamp)?.toMillis?.() ?? Date.now(),
  updatedAt: (data.updatedAt as Timestamp)?.toMillis?.() ?? Date.now(),
});
