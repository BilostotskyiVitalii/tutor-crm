// CHANGED — шлемо числа (ms), без serverTimestamp()
import { useGetLessonByIdQuery } from '@/features/lessons/api/lessonsApi';
import type {
  LessonData,
  LessonFormValues,
} from '@/features/lessons/types/lessonTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';

export const useBuildLessonData = (editedLessonId?: string | null) => {
  const { data: students = [] } = useGetStudentsQuery();
  const { data: lesson } = useGetLessonByIdQuery(editedLessonId ?? '', {
    skip: !editedLessonId,
  });

  const buildLessonData = (formValues: LessonFormValues): LessonData => {
    const studentMap = new Map(students.map((s) => [s.id, s]));
    const lessonMap = new Map(lesson?.students.map((s) => [s.id, s]) ?? []);

    const selectedStudents = formValues.studentIds.map((id) => {
      const s = studentMap.get(id) ||
        lessonMap.get(id) || { id, name: id, email: '' };
      return { id: s.id, name: s.name, email: s.email || '' };
    });

    return {
      students: selectedStudents,
      groupId: formValues.groupId || null,
      start: formValues.date[0].toDate().valueOf(), // ✅ ms
      end: formValues.date[1].toDate().valueOf(), // ✅ ms
      notes: formValues.notes || null,
      price: formValues.price,
    };
  };

  return { buildLessonData };
};
