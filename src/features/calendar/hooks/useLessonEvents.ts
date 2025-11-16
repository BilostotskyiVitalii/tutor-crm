import { useMemo } from 'react';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';

export const useLessonEvents = () => {
  const { data: lessons = [], isLoading: isLessonsLoading } =
    useGetLessonsQuery();
  const { data: groups = [] } = useGetGroupsQuery();
  console.log(lessons);

  const calendarEvents = useMemo(() => {
    if (lessons.length === 0) {
      return [];
    }

    return lessons.map((lesson) => {
      const group = groups?.find((g) => g.id === lesson.groupId);

      return {
        id: lesson.id,
        title: group
          ? group.title
          : lesson.students.map((s) => s.name).join(', ') || 'No students',
        start: new Date(lesson.start),
        end: new Date(lesson.end),
        resource: lesson,
      };
    });
  }, [lessons, groups]);

  return {
    calendarEvents,
    isLessonsLoading,
  };
};
