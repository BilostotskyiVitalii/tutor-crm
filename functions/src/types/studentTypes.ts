import type { Timestamp } from 'firebase/firestore';

export interface StudentData {
  name: string;
  email: string;
  phone: string | null;
  contact: string | null;
  birthdate: Timestamp | null;
  currentLevel: string;
  price: number;
  notes: string | null;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Student extends StudentData {
  id: string;
}
