import type { Dayjs } from 'dayjs';

export type StudentStatus = 'active' | 'paused' | 'archived';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  contact: string;
  birthdate: number | '';
  currentLevel: string;
  cost: number;
  notes: string;
  avatarUrl?: string;
  status: StudentStatus;
  createdAt: number;
  updatedAt: number;
}

export type StudentData = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;

export interface StudentFormValues
  extends Omit<Student, 'id' | 'birthdate' | 'createdAt' | 'updatedAt'> {
  birthdate: Dayjs | null;
}

export type UpdateUser = {
  id: string;
  data: Partial<StudentData>;
};
