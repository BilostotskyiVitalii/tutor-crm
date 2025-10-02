import { type FC, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Spin } from 'antd';

import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import LessonCard from '@/features/lessons/components/LessonCard/LessonCard';
import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import type { ModalState } from '@/features/lessons/types/lessonTypes';

const SchedulePage: FC = () => {
  const { data: lessons, isLoading, isError } = useGetLessonsQuery();
  const [modalState, setModalState] = useState<ModalState>(null);

  const openLessonModal = (lessonId: string | null = null) => {
    setModalState({ type: 'lesson', lessonId });
  };

  const closeModal = () => setModalState(null);

  return (
    <>
      <Flex vertical gap="large">
        <Space direction="vertical" size="large">
          <h1>Schedule</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openLessonModal()}
          >
            New lesson
          </Button>
        </Space>

        <Flex wrap gap="large">
          {isError && <p style={{ color: 'red' }}>Failed to load Lessons</p>}
          {isLoading && <Spin size="large" />}
          {lessons?.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onEdit={() => openLessonModal(lesson.id)}
            />
          ))}
        </Flex>
      </Flex>
      {modalState?.type === 'lesson' && (
        <LessonFormModal
          isModalOpen
          onClose={closeModal}
          editedLessonId={modalState?.lessonId}
        />
      )}
    </>
  );
};

export default SchedulePage;
