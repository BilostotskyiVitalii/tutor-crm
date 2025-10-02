import { Link } from 'react-router-dom';

import { Avatar, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { StatusDropdown } from '@/features/students/components/StudentStatusDropdown/StudentStatusDropdown';
import { StudentStatus } from '@/features/students/constants/constants';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import { type Student } from '@/features/students/types/studentTypes';
import { navigationUrls } from '@/shared/constants/navigationUrls';
import { getAvatarColorClass } from '@/shared/utils/getAvatarColorClass';

interface Props {
  onEdit: (student: Student) => void;
  onAddLesson: (student: Student) => void;
}

const { active, inactive } = StudentStatus;
const { students } = navigationUrls;

export function useStudentColumns({ onEdit, onAddLesson }: Props) {
  const { removeStudent } = useStudentActions();

  const columns: ColumnsType<Student> = [
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      width: 80,
      render: (avatarUrl: string | null, student) => (
        <Avatar
          src={avatarUrl ?? undefined}
          className={`avatar ${getAvatarColorClass(student.name)}`}
          size={50}
        >
          {!avatarUrl && student.name?.[0]}
        </Avatar>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, student) => (
        <Link to={`${students}/${student.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
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
      width: 150,
      sorter: (a, b) => a.currentLevel.localeCompare(b.currentLevel),
      render: (val) => val,
    },
    {
      title: 'Price',
      dataIndex: 'cost',
      key: 'cost',
      width: 150,
      sorter: (a, b) => (a.cost ?? 0) - (b.cost ?? 0),
      render: (val) => (val !== null ? `₴ ${val}` : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, student) => (
        <>
          <Button size="small" onClick={() => onEdit(student)}>
            Edit
          </Button>{' '}
          <Button size="small" onClick={() => onAddLesson(student)}>
            Add Lesson
          </Button>{' '}
          <Popconfirm
            title="Delete student?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => removeStudent(student.id)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return columns;
}
