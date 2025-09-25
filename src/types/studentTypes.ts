import type { Dayjs } from 'dayjs';

export interface Student {
  id: string;
  name: string;
  email: string;
  birthdate: number | '';
  cost: number;
  notes: string;
  avatarUrl?: string;
}

export interface StudentFormValues extends Omit<Student, 'id' | 'birthdate'> {
  birthdate: Dayjs | null;
}

export type StudentData = Omit<Student, 'id'>;

export type UpdateUser = {
  id: string;
  data: Partial<StudentData>;
};
