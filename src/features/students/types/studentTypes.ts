import type { Dayjs } from 'dayjs';

import type { Lesson } from '@/features/lessons/types/lessonTypes';

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
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export type StudentData = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;

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

export type StudentStatsReq = {
  doneLessons: number;
  plannedLessons: number;
  totalHours: number;
  totalRevenue: number;
  avgHourPrice: number;
  lessons: Lesson[];
  lessonsByDayOfWeek: { day: number; count: number }[];
};

export type StudentStatsRes = {
  id: string;
  start?: string;
  end?: string;
};
