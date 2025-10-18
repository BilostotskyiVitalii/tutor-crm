import type { Timestamp } from 'firebase/firestore';

export interface LessonData {
  groupId: string | null;
  students: {
    id: string;
    name: string;
    email: string;
  }[];
  start: Timestamp;
  end: Timestamp;
  notes: string | null;
  price: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Lesson extends LessonData {
  id: string;
}
