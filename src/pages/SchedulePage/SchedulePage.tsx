import { type FC, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Spin } from 'antd';

import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import LessonCard from '@/features/lessons/components/LessonCard/LessonCard';
import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import type { Lesson } from '@/features/lessons/types/lessonTypes';

const SchedulePage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data: lessons, isLoading, isError } = useGetLessonsQuery();
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
          {isError && <p style={{ color: 'red' }}>Failed to load Lessons</p>}
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
