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

// export type UpdateUser = {
//   id: string;
//   data: Partial<StudentData>;
// };

// export const studentStatus = {
//   active: 'active',
//   inactive: 'inactive',
// } as const;

// export interface StudentFormValues
//   extends Omit<Student, 'id' | 'birthdate' | 'createdAt' | 'updatedAt'> {
//   birthdate: Dayjs | null;
// }
