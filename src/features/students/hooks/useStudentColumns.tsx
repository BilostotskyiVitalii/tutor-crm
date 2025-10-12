import { Link } from 'react-router-dom';

import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { StatusDropdown } from '@/features/students/components/StudentStatusDropdown/StudentStatusDropdown';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import {
  type Student,
  studentStatus,
} from '@/features/students/types/studentTypes';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { useModal } from '@/shared/providers/ModalProvider';

const { active, inactive } = studentStatus;

export const useStudentColumns = (): ColumnsType<Student> => {
  const { removeStudent } = useStudentActions();
  const { openModal } = useModal();

  return [
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (avatarUrl: string | null, student) => (
        <AvatarCustom
          src={avatarUrl ?? null}
          name={student.name}
          inactive={student.isActive}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, student) => (
        <Link to={`${navigationUrls.students}/${student.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: active, value: true },
        { text: inactive, value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (_, student) => <StatusDropdown student={student} />,
    },
    {
      title: 'Level',
      dataIndex: 'currentLevel',
      key: 'currentLevel',
      sorter: (a, b) => a.currentLevel.localeCompare(b.currentLevel),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => (a.price ?? 0) - (b.price ?? 0),
      render: (val) => (val !== null ? `₴ ${val}` : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, student) => (
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
          </Button>{' '}
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
      ),
    },
  ];
};
