import { useCallback } from 'react';
import type { SlotInfo } from 'react-big-calendar';

import type { Dayjs } from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import { useModal } from '@/shared/providers/ModalProvider';

import type { DropEventProps, LessonEvent } from '../types/calendarTypes';

import styles from '../components/CustomCalendar/CustomCalendar.module.scss';

export const useCalendarHandlers = (setCurrentDate: (date: Dayjs) => void) => {
  const { updateLessonData } = useLessonActions();
  const { openModal } = useModal();

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

  const onSlotClick = useCallback(
    (slotInfo: SlotInfo) => {
      openModal({
        type: 'lesson',
        mode: 'create',
        extra: {
          preStart: slotInfo.start,
          preEnd: new Date(slotInfo.start.getTime() + 60 * 60 * 1000),
        },
      });
    },
    [openModal],
  );

  const onEventClick = useCallback(
    (event: LessonEvent) => {
      openModal({
        type: 'lesson',
        mode: 'edit',
        entityId: event.id,
        extra: { preGroup: event.resource.groupId },
      });
    },
    [openModal],
  );

  const handleDateChange = useCallback(
    (date: Dayjs) => setCurrentDate(date),
    [setCurrentDate],
  );

  const getEventProps = useCallback((event: LessonEvent) => {
    const isGroup = Boolean(event.resource.groupId);
    return {
      className: `${styles.calendarLesson} ${
        isGroup ? styles.groupLesson : styles.indivLesson
      }`,
    };
  }, []);

  return {
    handleEventDrop,
    onSlotClick,
    onEventClick,
    handleDateChange,
    getEventProps,
  };
};
