import { type FC, useCallback, useMemo, useState } from 'react';
import {
  Calendar as RBC,
  dateFnsLocalizer,
  type SlotInfo,
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

import { useLessonEvents } from '@/features/calendar/hooks/useLessonEvents';
import type {
  DropEventProps,
  LessonEvent,
} from '@/features/calendar/types/calendarTypes';
import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import { useModal } from '@/shared/providers/ModalProvider';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './CustomCalendar.module.scss';

const DnDCalendar = withDragAndDrop<LessonEvent, object>(RBC);

const CustomCalendar: FC = () => {
  const { data: lessons, isLoading } = useGetLessonsQuery();
  const { data: groups } = useGetGroupsQuery();
  const { updateLessonData } = useLessonActions();
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const calendarEvents = useLessonEvents(lessons, groups);

  const { openModal } = useModal();

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

  function onSlotClick(slotInfo: SlotInfo) {
    openModal({
      type: 'lesson',
      mode: 'create',
      extra: {
        preStart: slotInfo.start,
        preEnd: new Date(slotInfo.start.getTime() + 60 * 60 * 1000),
      },
    });
  }

  function getEventProps(event: LessonEvent) {
    const isGroup = Boolean(event.resource.groupId);
    return {
      className: `${styles.calendarLesson} ${isGroup ? styles.groupLesson : styles.indivLesson}`,
    };
  }

  function onEventClick(event: LessonEvent) {
    openModal({
      type: 'lesson',
      mode: 'edit',
      entityId: (event as LessonEvent).id,
      extra: {
        preGroup: (event as LessonEvent).resource.groupId,
      },
    });
  }

  return (
    <Flex className={styles.calendarWrapper}>
      <div className={styles.miniCalendarWrapper}>
        <AntdCalendar
          fullscreen={false}
          value={currentDate}
          onSelect={(date: Dayjs) => setCurrentDate(date)}
          onPanelChange={(date: Dayjs) => setCurrentDate(date)}
        />
      </div>
      <Spin
        spinning={isLoading}
        size="large"
        tip="Loading lessons..."
        wrapperClassName={styles.mainCalendarWrapper}
      >
        <div className={styles.mainCalendarContainer}>
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
            selectable
            onSelectEvent={onEventClick}
            onSelectSlot={onSlotClick}
            eventPropGetter={getEventProps}
            onEventDrop={handleEventDrop}
          />
        </div>
      </Spin>
    </Flex>
  );
};

export default CustomCalendar;
