import { LessonFormModal } from '@/components';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useGetLessonsQuery } from '@/store/lessonsApi';
import { Button } from 'antd';
import { useState, type FC } from 'react';

const Calendar: FC = () => {
  const tutorId = useAppSelector((state) => state.user.id);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data: lessons } = useGetLessonsQuery(tutorId ?? '');

  function onClose() {
    setIsModalOpen(false);
  }

  function onOpen() {
    setIsModalOpen(true);
  }

  return (
    <>
      <h1 className="pageTitle">Calendar</h1>
      <Button onClick={onOpen}>Add lesson</Button>
      {lessons?.map((lesson) => {
        return (
          <div key={lesson.id}>
            <h2>{lesson.title}</h2>
            <div>{lesson.notes}</div>
          </div>
        );
      })}
      <LessonFormModal visible={isModalOpen} onClose={onClose} />
    </>
  );
};

export default Calendar;
