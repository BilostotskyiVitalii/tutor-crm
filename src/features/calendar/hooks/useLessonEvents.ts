import { useMemo } from 'react';

import type { LessonEvent } from '@/features/calendar/types/calendarTypes';
import type { Group } from '@/features/groups/types/groupTypes';
import type { Lesson } from '@/features/lessons/types/lessonTypes';

export const useLessonEvents = (
  lessons?: Lesson[],
  groups?: Group[],
): LessonEvent[] => {
  return useMemo(() => {
    if (!lessons) {
      return [];
    }
    return lessons.map((lesson) => {
      const group = groups?.find((g) => g.id === lesson.groupId);
      return {
        id: lesson.id,
        title: group
          ? group.title
          : lesson.students.map((s) => s.name).join(', '),
        start: new Date(lesson.start),
        end: new Date(lesson.end),
        resource: lesson,
      };
    });
  }, [lessons, groups]);
};
