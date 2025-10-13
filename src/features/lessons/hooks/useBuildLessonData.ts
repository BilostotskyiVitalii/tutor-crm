import { Timestamp } from 'firebase/firestore';

import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import type {
  LessonData,
  LessonFormValues,
} from '@/features/lessons/types/lessonTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';

export const useBuildLessonData = () => {
  const { data: students = [] } = useGetStudentsQuery();
  const { data: lessons = [] } = useGetLessonsQuery();

  const buildLessonData = (
    formValues: LessonFormValues,
    editedLessonId?: string | null,
  ): LessonData => {
    const lesson = editedLessonId
      ? lessons.find((l) => l.id === editedLessonId)
      : null;

    const studentMap = new Map(students.map((s) => [s.id, s]));
    const lessonMap = new Map(lesson?.students.map((s) => [s.id, s]) ?? []);

    const selectedStudents = formValues.studentIds.map((id) => {
      const student = studentMap.get(id) ||
        lessonMap.get(id) || { id, name: id, email: '' };
      return {
        id: student.id,
        name: student.name,
        email: student.email || '',
      };
    });

    return {
      students: selectedStudents,
      groupId: formValues.groupId || null,
      start: Timestamp.fromMillis(formValues.date[0].valueOf()),
      end: Timestamp.fromMillis(formValues.date[1].valueOf()),
      notes: formValues.notes || null,
      price: formValues.price,
    };
  };

  return { buildLessonData };
};
