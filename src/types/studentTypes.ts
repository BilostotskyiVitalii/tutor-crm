import type { Dayjs } from 'dayjs';

export interface Student {
  id: string;
  tutorId: string;
  name: string;
  email: string;
  birthdate: number | '';
  cost: number;
  notes: string;
}

export interface StudentFormValues
  extends Omit<Student, 'id' | 'userId' | 'birthdate'> {
  birthdate: Dayjs | null;
}

export type StudentData = Omit<Student, 'id'>;

export type UpdateUser = {
  id: string;
  data: Partial<StudentData>;
};

export interface StudentsGroup {
  id: string;
  name: string;
  tutorId: string;
  studentIds: string[];
  notes?: string;
}
