export interface Lesson {
  id: string;
  type: 'individual' | 'group';
  tutorId: string;
  studentId?: string;
  groupId?: string;
  studentIds?: string[];
  start: string;
  end: string;
  title?: string;
  notes?: string;
}

export type LessonData = Omit<Lesson, 'id'>;

export type LessonFormValues = Omit<Lesson, 'id' | 'tutorId'>;

export type UpdateLesson = {
  id: string;
  data: Partial<Lesson>;
};
