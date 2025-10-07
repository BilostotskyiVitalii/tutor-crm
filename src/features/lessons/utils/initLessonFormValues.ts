import dayjs from 'dayjs';

import type { Group } from '@/features/groups/types/groupTypes';
import type {
  Lesson,
  LessonFormValues,
} from '@/features/lessons/types/lessonTypes';
import type { Student } from '@/features/students/types/studentTypes';

interface InitialFormResult {
  values: Partial<LessonFormValues>;
  isGroup: boolean;
}

export const initLessonFormValues = (
  lessons: Lesson[],
  students: Student[],
  groups: Group[],
  editedLessonId?: string | null,
  defaultStudent?: string | null,
  defaultGroup?: string | null,
  defaultStart?: Date | null,
  defaultEnd?: Date | null,
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

  if (defaultStart && defaultEnd) {
    return {
      values: {
        date: [dayjs(defaultStart), dayjs(defaultEnd)],
      },
      isGroup: false,
    };
  }

  return { values: {}, isGroup: false };
};
