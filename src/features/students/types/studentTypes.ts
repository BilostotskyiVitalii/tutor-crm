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

export interface StudentFormValues
  extends Omit<Student, 'id' | 'birthdate' | 'createdAt' | 'updatedAt'> {
  birthdate: Dayjs | null;
}

export type UpdateUser = {
  id: string;
  data: Partial<StudentData>;
};

export interface StudentFormProps {
  isModalOpen: boolean;
  onClose: () => void;
  editedStudent?: Student | null;
}

export type ModalState =
  | { type: 'student'; student: Student | null }
  | { type: 'lesson'; student: Student }
  | null;
