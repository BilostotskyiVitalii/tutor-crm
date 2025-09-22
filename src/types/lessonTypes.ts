import type { Dayjs } from 'dayjs';

export interface Lesson {
  id: string;
  tutorId: string;
  groupId: string;
  studentIds: string[];
  start: number;
  end: number;
  notes: string;
}

export type LessonData = Omit<Lesson, 'id'>;

export interface LessonFormValues
  extends Omit<Lesson, 'id' | 'tutorId' | 'start' | 'end'> {
  date: Dayjs[];
}

export type CreateLessonValues = Omit<Lesson, 'id' | 'tutorId'>;

export type UpdateLesson = {
  id: string;
  data: Partial<CreateLessonValues>;
};
