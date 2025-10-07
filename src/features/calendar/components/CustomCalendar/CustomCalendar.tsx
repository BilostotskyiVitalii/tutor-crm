import { type FC, useCallback, useMemo, useState } from 'react';
import { Calendar as RBC, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import { Calendar as AntdCalendar, Flex } from 'antd';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { ru } from 'date-fns/locale/ru';
import { uk } from 'date-fns/locale/uk';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import { useLessonEvents } from '@/features/calendar/hooks/useLessonEvents';
import type {
  CustomCalendarProps,
  DropEventProps,
  LessonEvent,
} from '@/features/calendar/types/calendarTypes';
import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import CustomSpinner from '@/shared/components/UI/CustomSpinner/CustomSpinner';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const CustomCalendar: FC<CustomCalendarProps> = ({ setModalState }) => {
  const { data: lessons, isLoading } = useGetLessonsQuery();
  const { data: groups } = useGetGroupsQuery();
  const { updateLessonData } = useLessonActions();
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const calendarEvents = useLessonEvents(lessons, groups);
  const DnDCalendar = withDragAndDrop<LessonEvent, object>(RBC);

  const locales = useMemo(() => ({ enUS, uk, ru }), []);
  const localizer = useMemo(
    () =>
      dateFnsLocalizer({
        format,
        parse,
        startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
        getDay,
        locales,
      }),
    [locales],
  );

  const openLessonModal = (lessonId: string | null = null) => {
    setModalState({ type: 'lesson', lessonId });
  };

  const handleEventDrop = useCallback(
    ({ event, start, end }: DropEventProps) => {
      const oldStart = (event.start as Date).getTime();
      const oldEnd = (event.end as Date).getTime();
      const newStart = new Date(start).getTime();
      const newEnd = new Date(end).getTime();

      if (oldStart === newStart && oldEnd === newEnd) {
        return;
      }

      updateLessonData(event.id, {
        start: Timestamp.fromDate(new Date(start)),
        end: Timestamp.fromDate(new Date(end)),
      });
    },
    [updateLessonData],
  );

  return (
    <>
      {isLoading && <CustomSpinner />}

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
            views={['week', 'day', 'agenda']}
            defaultView="week"
            date={currentDate.toDate()}
            onNavigate={(date) => setCurrentDate(dayjs(date))}
            scrollToTime={new Date(1970, 1, 1, 8, 0, 0)}
            startAccessor={(event) => (event as LessonEvent).start}
            endAccessor={(event) => (event as LessonEvent).end}
            onSelectEvent={(event) =>
              openLessonModal((event as LessonEvent).id)
            }
            selectable
            onSelectSlot={(slotInfo) => {
              setModalState({
                type: 'lesson',
                lessonId: null,
                start: slotInfo.start,
                end: new Date(slotInfo.start.getTime() + 60 * 60 * 1000),
              });
            }}
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
    </>
  );
};

export default CustomCalendar;
