import type { Dayjs } from 'dayjs';
import type { Timestamp } from 'firebase/firestore';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  contact: string | null;
  birthdate: number | null;
  currentLevel: string;
  price: number;
  notes: string | null;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface StudentData
  extends Omit<Student, 'id' | 'birthdate' | 'createdAt' | 'updatedAt'> {
  birthdate: Timestamp | null;
}

export type UpdateUser = {
  id: string;
  data: Partial<StudentData>;
};

export const studentStatus = {
  active: 'active',
  inactive: 'inactive',
} as const;

export interface StudentFormValues
  extends Omit<Student, 'id' | 'birthdate' | 'createdAt' | 'updatedAt'> {
  birthdate: Dayjs | null;
}
