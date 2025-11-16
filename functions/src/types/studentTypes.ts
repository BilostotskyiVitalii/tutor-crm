import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export interface StudentData {
  name: string;
  email: string | null;
  phone: string | null;
  contact: string | null;
  birthdate: Timestamp | null;
  currentLevel: string | null;
  price: number;
  notes: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface Student extends StudentData {
  id: string;
}
