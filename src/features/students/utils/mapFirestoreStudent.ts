import type { DocumentData, Timestamp } from 'firebase/firestore';

import type { Student } from '@/features/students/types/studentTypes';

export const mapFirestoreStudent = (
  id: string,
  data: DocumentData,
): Student => ({
  id,
  name: data.name ?? '',
  email: data.email ?? '',
  phone: data.phone ?? null,
  contact: data.contact ?? null,
  birthdate: (data.birthdate as Timestamp)?.toMillis?.() ?? null,
  currentLevel: data.currentLevel ?? '',
  price: data.price ?? 0,
  notes: data.notes ?? null,
  avatarUrl: data.avatarUrl ?? undefined,
  isActive: data.isActive ?? true,
  createdAt: (data.createdAt as Timestamp)?.toMillis?.() ?? Date.now(),
  updatedAt: (data.updatedAt as Timestamp)?.toMillis?.() ?? Date.now(),
});
