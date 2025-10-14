import type { FieldValue, Timestamp } from 'firebase/firestore';

export interface Group {
  id: string;
  title: string;
  studentIds: string[];
  notes?: string | null;
  price: number;
  createdAt: number;
  updatedAt: number;
}

export interface GroupData
  extends Omit<Group, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt?: FieldValue | Timestamp;
  updatedAt?: FieldValue | Timestamp;
}

export type UpdateGroup = {
  id: string;
  data: Partial<GroupData>;
};
