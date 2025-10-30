import type { FC } from 'react';

import { Button, Space } from 'antd';

import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type { Student } from '@/features/students/types/studentTypes';
import { useModal } from '@/shared/providers/ModalProvider';

interface StudentTableActionsProps {
  student: Student;
}

export const StudentTableActions: FC<StudentTableActionsProps> = ({
  student,
}) => {
  const { removeStudent } = useStudentActions();
  const { openModal } = useModal();

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
        Edit
      </Button>
      <Button
        onClick={onCreateLesson}
        size="small"
        disabled={!student.isActive}
      >
        Add Lesson
      </Button>
      <Button onClick={onDeleteStudent} size="small" danger>
        Delete
      </Button>
    </Space>
  );
};
