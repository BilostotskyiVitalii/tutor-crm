import { type FC, useState } from 'react';
import { Calendar as RBC } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import { Calendar as AntdCalendar, Flex, Spin } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { useCalendarHandlers } from '@/features/calendar/hooks/useCalendarHandlers';
import { useCalendarLocalizer } from '@/features/calendar/hooks/useCalendarLocalizer';
import { useLessonEvents } from '@/features/calendar/hooks/useLessonEvents';
import type { LessonEvent } from '@/features/calendar/types/calendarTypes';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './CustomCalendar.module.scss';

const DnDCalendar = withDragAndDrop<LessonEvent, object>(RBC);

const CustomCalendar: FC = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const { calendarEvents, isLessonsLoading } = useLessonEvents();
  const localizer = useCalendarLocalizer();
  const SCROLL_TIME = new Date(1970, 1, 1, 8, 0, 0);

  const {
    handleEventDrop,
    onSlotClick,
    onEventClick,
    handleDateChange,
    getEventProps,
  } = useCalendarHandlers(setCurrentDate);

  return (
    <Flex className={styles.calendarWrapper}>
      <div className={styles.miniCalendarWrapper}>
        <AntdCalendar
          fullscreen={false}
          value={currentDate}
          onSelect={handleDateChange}
          onPanelChange={handleDateChange}
        />
      </div>
      <Spin
        spinning={isLessonsLoading}
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
            scrollToTime={SCROLL_TIME}
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
