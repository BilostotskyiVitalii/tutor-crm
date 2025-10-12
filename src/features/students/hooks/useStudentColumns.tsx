import { Link } from 'react-router-dom';

import type { ColumnsType } from 'antd/es/table';

import { StatusDropdown } from '@/features/students/components/StudentStatusDropdown/StudentStatusDropdown';
import { StudentTableActions } from '@/features/students/components/StudentTableAction/StudentTableAction';
import {
  type Student,
  studentStatus,
} from '@/features/students/types/studentTypes';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';
import { navigationUrls } from '@/shared/constants/navigationUrls';

const { active, inactive } = studentStatus;

export const useStudentColumns = (): ColumnsType<Student> => {
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
      render: (_, student) => <StudentTableActions student={student} />,
    },
  ];
};
