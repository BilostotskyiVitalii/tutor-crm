import { type Event as RBCEvent } from 'react-big-calendar';

import type { Lesson } from '@/features/lessons/types/lessonTypes';

export type LessonEvent = RBCEvent & {
  resource: Lesson;
  id: string;
  title: string;
  start: Date;
  end: Date;
};

export type DropEventProps = {
  event: LessonEvent;
  start: string | Date;
  end: string | Date;
};
