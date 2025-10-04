import { type FC, useMemo, useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  type Event as RBCEvent,
} from 'react-big-calendar';

import { Flex, Space, Spin } from 'antd';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { ru } from 'date-fns/locale/ru';
import { uk } from 'date-fns/locale/uk';

import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import type { Lesson, ModalState } from '@/features/lessons/types/lessonTypes';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './SchedulePage.module.scss';

const locales = {
  enUS,
  uk,
  ru,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface LessonEvent extends RBCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Lesson;
}

const SchedulePage: FC = () => {
  const { data: lessons, isLoading, isError } = useGetLessonsQuery();
  const [modalState, setModalState] = useState<ModalState>(null);

  const openLessonModal = (lessonId: string | null = null) => {
    setModalState({ type: 'lesson', lessonId });
  };

  const closeModal = () => setModalState(null);

  const calendarEvents: LessonEvent[] = useMemo(() => {
    return (
      lessons?.map((lesson) => ({
        id: lesson.id,
        title:
          lesson.groupId && lesson.groupId !== ''
            ? `Group: ${lesson.groupId}`
            : lesson.students.map((s) => s.name).join(', ') || 'Lesson',
        start: new Date(lesson.start),
        end: new Date(lesson.end),
        resource: lesson,
      })) || []
    );
  }, [lessons]);

  const eventPropGetter = (event: LessonEvent) => {
    const isGroup = Boolean(event.resource.groupId);
    return {
      className: `${styles.event} ${
        isGroup ? styles.groupEvent : styles.individualEvent
      }`,
    };
  };

  return (
    <Flex vertical gap="large">
      {isError && <p style={{ color: 'red' }}>Failed to load Lessons</p>}
      {isLoading && <Spin size="large" />}
      <Space direction="vertical" size="large" />

      <div className={styles.calendarContainer}>
        <Calendar<LessonEvent>
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={(event) => openLessonModal(event.id)}
          eventPropGetter={eventPropGetter}
        />
      </div>

      {modalState?.type === 'lesson' && (
        <LessonFormModal
          isModalOpen
          onClose={closeModal}
          editedLessonId={modalState?.lessonId}
        />
      )}
    </Flex>
  );
};

export default SchedulePage;
