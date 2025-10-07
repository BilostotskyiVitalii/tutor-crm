import { type FC, useMemo, useState } from 'react';
import {
  Calendar as RBC,
  dateFnsLocalizer,
  type Event as RBCEvent,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import { Calendar as AntdCalendar, Flex, Spin } from 'antd';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { ru } from 'date-fns/locale/ru';
import { uk } from 'date-fns/locale/uk';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import type { Lesson, ModalState } from '@/features/lessons/types/lessonTypes';

import 'react-big-calendar/lib/css/react-big-calendar.css';

type LessonEvent = RBCEvent & {
  resource: Lesson;
  id: string;
  title: string;
  start: Date;
  end: Date;
};

const locales = { enUS, uk, ru };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(RBC);

const SchedulePage: FC = () => {
  const { data: lessons, isLoading, isError } = useGetLessonsQuery();
  const { data: groups } = useGetGroupsQuery();
  const [modalState, setModalState] = useState<ModalState>(null);
  const { updateLessonData } = useLessonActions();
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());

  const openLessonModal = (lessonId: string | null = null) => {
    setModalState({ type: 'lesson', lessonId });
  };
  const closeModal = () => setModalState(null);

  const calendarEvents: LessonEvent[] = useMemo(() => {
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

  const handleEventDrop = ({
    event,
    start,
    end,
  }: {
    event: object;
    start: string | Date;
    end: string | Date;
  }) => {
    const e = event as LessonEvent;
    updateLessonData(e.id, {
      start: Timestamp.fromDate(new Date(start)),
      end: Timestamp.fromDate(new Date(end)),
    });
  };

  return (
    <Flex vertical gap="large">
      {isError && <p style={{ color: 'red' }}>Failed to load Lessons</p>}
      {isLoading && <Spin size="large" />}

      <Flex className="calendarWrapper">
        <div className="miniCalendar">
          <AntdCalendar
            fullscreen={false}
            value={currentDate}
            onSelect={(date: Dayjs) => setCurrentDate(date)}
            onPanelChange={(date: Dayjs) => setCurrentDate(date)}
          />
        </div>

        <div className="calendarContainer">
          <DnDCalendar
            localizer={localizer}
            events={calendarEvents}
            defaultView="week"
            date={currentDate.toDate()}
            onNavigate={(date) => setCurrentDate(dayjs(date))}
            scrollToTime={new Date(1970, 1, 1, 8, 0, 0)}
            startAccessor={(event) => (event as LessonEvent).start}
            endAccessor={(event) => (event as LessonEvent).end}
            onSelectEvent={(event) =>
              openLessonModal((event as LessonEvent).id)
            }
            eventPropGetter={(event) => {
              const e = event as LessonEvent;
              const isGroup = Boolean(e.resource.groupId);
              return {
                className: `calendarLesson ${
                  isGroup ? 'groupLesson' : 'indivLesson'
                }`,
              };
            }}
            onEventDrop={handleEventDrop}
          />
        </div>
      </Flex>

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
