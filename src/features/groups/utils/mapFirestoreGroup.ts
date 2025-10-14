import type { DocumentData, Timestamp } from 'firebase/firestore';

import type { Group } from '@/features/groups/types/groupTypes';

export const mapFirestoreGroup = (id: string, data: DocumentData): Group => ({
  id,
  title: data.title ?? '',
  studentIds: data.studentIds ?? [],
  notes: data.notes ?? null,
  price: data.price ?? 0,
  createdAt: (data.createdAt as Timestamp)?.toMillis?.() ?? Date.now(),
  updatedAt: (data.updatedAt as Timestamp)?.toMillis?.() ?? Date.now(),
});
