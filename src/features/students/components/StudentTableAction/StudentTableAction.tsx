import type { FC } from 'react';

import { Button } from 'antd';

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

  return (
    <>
      <Button
        onClick={() =>
          openModal({
            type: 'student',
            mode: 'edit',
            entityId: student.id,
          })
        }
        size="small"
      >
        Edit
      </Button>
      <Button
        onClick={() =>
          openModal({
            type: 'lesson',
            mode: 'create',
            extra: { preStudent: student.id },
          })
        }
        size="small"
        disabled={!student.isActive}
      >
        Add Lesson
      </Button>{' '}
      <Button onClick={() => removeStudent(student.id)} size="small" danger>
        Delete
      </Button>
    </>
  );
};
