import { type FC, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Spin } from 'antd';

import { LessonCard, LessonFormModal } from '@/components';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useGetLessonsQuery } from '@/store/lessonsApi';
import type { Lesson } from '@/types/lessonTypes';

const SchedulePage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const tutorId = useAppSelector((state) => state.user.id);
  const { data: lessons, isLoading, error } = useGetLessonsQuery(tutorId ?? '');
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
      <Flex vertical gap="large">
        <Space direction="vertical" size="large">
          <h1>Schedule</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={onOpen}>
            New lesson
          </Button>
        </Space>

        <Flex wrap gap="large">
          {error && <p style={{ color: 'red' }}>Failed to load Lessons</p>}
          {isLoading && <Spin size="large" />}
          {lessons?.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} onEdit={showEdit} />
          ))}
        </Flex>
      </Flex>
      <LessonFormModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        editedLesson={editedLesson}
      />
    </>
  );
};

export default SchedulePage;
