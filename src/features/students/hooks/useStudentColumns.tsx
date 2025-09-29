import { Link } from 'react-router-dom';

import { Avatar, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useDeleteStudentMutation } from '@/features/students/api/studentsApi';
import { StatusDropdown } from '@/features/students/components/StudentStatusDropdown/StudentStatusDropdown';
import type { Student } from '@/features/students/types/studentTypes';
import { getAvatarColorClass } from '@/shared/utils/getAvatarColorClass';

interface Props {
  onEdit: (student: Student) => void;
  onAddLesson: (student: Student) => void;
}

export function useStudentColumns({ onEdit, onAddLesson }: Props) {
  const [deleteStudent] = useDeleteStudentMutation();

  const columns: ColumnsType<Student> = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string | null, student) => (
        <Avatar
          src={avatar ?? undefined}
          className={`avatar ${getAvatarColorClass(student.name)}`}
        >
          {!avatar && student.name?.[0]}
        </Avatar>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, student) => (
        <Link to={`/students/${student.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Paused', value: 'paused' },
        { text: 'Archived', value: 'archived' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, student) => <StatusDropdown student={student} />,
    },
    {
      title: 'Level',
      dataIndex: 'currentLevel',
      key: 'currentLevel',
      sorter: (a, b) => a.currentLevel.localeCompare(b.currentLevel),
      render: (val) => val,
    },
    {
      title: 'Price',
      dataIndex: 'cost',
      key: 'cost',
      sorter: (a, b) => (a.cost ?? 0) - (b.cost ?? 0),
      render: (val) => (val !== null ? `$${val.toFixed(2)}` : '-'),
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
            onConfirm={() => deleteStudent(student.id)}
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
