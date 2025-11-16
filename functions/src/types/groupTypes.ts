import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export interface GroupData {
  title: string;
  studentIds: string[];
  notes?: string | null;
  price: number;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface Group extends GroupData {
  id: string;
}
