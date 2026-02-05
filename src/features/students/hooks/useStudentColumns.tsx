import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { ColumnsType } from 'antd/es/table';

import { StudentActionsButtons } from '@/features/students/components/StudentActionsButtons/StudentActionsButtons';
import { StatusDropdown } from '@/features/students/components/StudentStatusDropdown/StudentStatusDropdown';
import {
  type Student,
  studentStatus,
} from '@/features/students/types/studentTypes';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';
import { navigationUrls } from '@/shared/constants/navigationUrls';

const { active, inactive } = studentStatus;

export const useStudentColumns = (): ColumnsType<Student> => {
  const { t } = useTranslation();

  return [
    {
      title: `${t('avatar')}`,
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
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, student) => (
        <Link to={`${navigationUrls.students}/${student.id}`}>{text}</Link>
      ),
    },
    {
      title: `${t('status')}`,
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
      title: `${t('level')}`,
      dataIndex: 'currentLevel',
      key: 'currentLevel',
      sorter: (a, b) => a.currentLevel.localeCompare(b.currentLevel),
    },
    {
      title: `${t('price')}`,
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => (a.price ?? 0) - (b.price ?? 0),
      render: (val) => (val !== null ? `₴ ${val}` : '-'),
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_, student) => <StudentActionsButtons student={student} />,
    },
  ];
};
