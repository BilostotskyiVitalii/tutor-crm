import type { Dayjs } from 'dayjs';

export interface Lesson {
  id: string;
  groupId: string;
  studentIds: string[];
  start: number;
  end: number;
  notes: string;
}

export type LessonData = Omit<Lesson, 'id'>;

export interface LessonFormValues extends Omit<Lesson, 'id' | 'start' | 'end'> {
  date: Dayjs[];
}

export type UpdateLesson = {
  id: string;
  data: Partial<LessonData>;
};
