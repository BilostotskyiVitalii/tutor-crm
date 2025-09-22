import { useState, type FC } from 'react';
import { Button } from 'antd';
import { LessonCard, LessonFormModal } from '@/components';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useGetLessonsQuery } from '@/store/lessonsApi';
import type { Lesson } from '@/types/lessonTypes';

const Calendar: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const tutorId = useAppSelector((state) => state.user.id);
  const { data: lessons } = useGetLessonsQuery(tutorId ?? '');
  const [editedLesson, setEditedLesson] = useState<Lesson | null>(null);

  function onClose() {
    setEditedLesson(null);
    setIsModalOpen(false);
  }

  function onOpen() {
    setEditedLesson(null);
    setIsModalOpen(true);
  }

  const showEdit = (lesson: Lesson) => {
    setEditedLesson(lesson);
    setIsModalOpen(true);
  };

  return (
    <>
      <h1 className="pageTitle">Calendar</h1>
      <Button onClick={onOpen}>Add lesson</Button>
      {lessons?.map((lesson) => {
        return <LessonCard key={lesson.id} lesson={lesson} onEdit={showEdit} />;
      })}
      <LessonFormModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        editedLesson={editedLesson}
      />
    </>
  );
};

export default Calendar;
