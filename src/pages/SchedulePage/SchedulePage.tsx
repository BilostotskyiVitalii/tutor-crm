import { type FC, useState } from 'react';

import { Flex } from 'antd';

import CustomCalendar from '@/features/calendar/components/CustomCalendar/CustomCalendar';
import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import type { ModalState } from '@/features/lessons/types/lessonTypes';

const SchedulePage: FC = () => {
  const [modalState, setModalState] = useState<ModalState>(null);

  const closeModal = () => setModalState(null);

  return (
    <Flex vertical gap="large">
      <CustomCalendar setModalState={setModalState} />

      {modalState?.type === 'lesson' && (
        <LessonFormModal
          isModalOpen
          onClose={closeModal}
          editedLessonId={modalState.lessonId}
          defaultStart={modalState.start ?? null}
          defaultEnd={modalState.end ?? null}
        />
      )}
    </Flex>
  );
};

export default SchedulePage;
