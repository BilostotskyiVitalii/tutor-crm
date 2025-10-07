import { Timestamp } from 'firebase/firestore';

import type {
  Lesson,
  LessonData,
  LessonFormValues,
} from '@/features/lessons/types/lessonTypes';
import type { Student } from '@/features/students/types/studentTypes';

export const buildLessonData = (
  formValues: LessonFormValues,
  students: Student[],
  lessons: Lesson[],
  editedLessonId?: string | null,
) => {
  const lesson = editedLessonId
    ? lessons.find((l) => l.id === editedLessonId)
    : null;

  const studentMap = new Map(students.map((s) => [s.id, s]));
  const lessonMap = new Map(lesson?.students.map((s) => [s.id, s]) ?? []);

  const selectedStudents = formValues.studentIds.map((id) => {
    const student = studentMap.get(id) ||
      lessonMap.get(id) || { id, name: id, email: '' };
    return { id: student.id, name: student.name, email: student.email || '' };
  });

  return {
    students: selectedStudents,
    groupId: formValues.groupId || null,
    start: Timestamp.fromMillis(formValues.date[0].valueOf()),
    end: Timestamp.fromMillis(formValues.date[1].valueOf()),
    notes: formValues.notes || null,
    price: formValues.price,
  } as LessonData;
};
