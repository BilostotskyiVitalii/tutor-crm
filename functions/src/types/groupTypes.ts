import type { Timestamp } from 'firebase/firestore';

export interface GroupData {
  title: string;
  studentIds: string[];
  notes?: string | null;
  price: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Group extends GroupData {
  id: string;
}
