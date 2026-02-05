import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Space } from 'antd';

import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type { Student } from '@/features/students/types/studentTypes';
import { useModal } from '@/shared/providers/ModalProvider';

interface StudentActionsProps {
  student: Student;
}

export const StudentActionsButtons: FC<StudentActionsProps> = ({ student }) => {
  const { removeStudent } = useStudentActions();
  const { openModal } = useModal();
  const { t } = useTranslation();

  function onEditStudent() {
    openModal({
      type: 'student',
      mode: 'edit',
      entity: student,
    });
  }

  function onCreateLesson() {
    openModal({
      type: 'lesson',
      mode: 'create',
      initData: { initStudent: student },
      entity: null,
    });
  }

  function onDeleteStudent() {
    removeStudent(student.id);
  }

  return (
    <Space>
      <Button onClick={onEditStudent} size="small">
        {t('edit')}
      </Button>
      <Button
        onClick={onCreateLesson}
        size="small"
        disabled={!student.isActive}
      >
        {t('addLesson')}
      </Button>
      <Button onClick={onDeleteStudent} size="small" danger>
        {t('delete')}
      </Button>
    </Space>
  );
};
