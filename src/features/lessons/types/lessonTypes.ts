import type { Dayjs } from 'dayjs';
import type { Timestamp } from 'firebase/firestore';

import type { Group } from '@/features/groups/types/groupTypes';

export interface Lesson {
  id: string;
  groupId: string | null;
  studentIds: string[];
  start: number;
  end: number;
  notes: string | null;
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
}

export type UpdateLesson = {
  id: string;
  data: Partial<LessonData>;
};

export interface LessonFormModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  editedLesson?: Lesson | null;
  defaultStudents?: string[];
  defaultGroup?: Group | null;
}
