import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import type { Group } from '@/features/groups/types/groupTypes';
import type {
  Lesson,
  LessonData,
  LessonFormValues,
} from '@/features/lessons/types/lessonTypes';
import type { Student } from '@/features/students/types/studentTypes';

interface InitialFormResult {
  values: Partial<LessonFormValues>;
  isGroup: boolean;
}

export const initializeFormValues = (
  lessons: Lesson[],
  students: Student[],
  groups: Group[],
  editedLessonId?: string | null,
  defaultStudent?: string | null,
  defaultGroup?: string | null,
): InitialFormResult => {
  if (editedLessonId) {
    const lesson = lessons.find((l) => l.id === editedLessonId);
    if (lesson) {
      return {
        values: {
          studentIds: lesson.students.map((s) => s.id),
          groupId: lesson.groupId,
          date: [dayjs(lesson.start), dayjs(lesson.end)],
          notes: lesson.notes || null,
          price: lesson.price,
        },
        isGroup: !!lesson.groupId,
      };
    }
  }

  if (defaultGroup) {
    const group = groups.find((g) => g.id === defaultGroup);
    if (group) {
      return {
        values: {
          studentIds: group.studentIds,
          groupId: group.id,
          price: group.price,
        },
        isGroup: true,
      };
    }
  }

  if (defaultStudent) {
    const student = students.find((s) => s.id === defaultStudent);
    return {
      values: {
        studentIds: [defaultStudent],
        price: student?.price,
      },
      isGroup: false,
    };
  }

  return { values: {}, isGroup: false };
};

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
