import type { Dayjs } from 'dayjs';
import type { Timestamp } from 'firebase/firestore';

export interface Lesson {
  id: string;
  groupId: string | null;
  students: {
    id: string;
    name: string;
    email: string;
  }[];
  start: number;
  end: number;
  notes: string | null;
  price: number;
  createdAt: number;
  updatedAt: number;
}

export interface LessonData
  extends Omit<Lesson, 'id' | 'start' | 'end' | 'createdAt' | 'updatedAt'> {
  start: Timestamp;
  end: Timestamp;
}

export interface LessonFormValues
  extends Omit<Lesson, 'id' | 'start' | 'end' | 'createdAt' | 'updatedAt'> {
  date: Dayjs[];
  studentIds: string[];
}

export type UpdateLesson = {
  id: string;
  data: Partial<LessonData>;
};
