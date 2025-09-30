import type { FC } from 'react';

import { Dropdown, Tag } from 'antd';

import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type {
  Student,
  StudentStatus,
} from '@/features/students/types/studentTypes';

const statusColors: Record<string, string> = {
  active: 'green',
  paused: 'orange',
  archived: 'gray',
};

export const StatusDropdown: FC<{ student: Student }> = ({ student }) => {
  const { updateStudentStatus } = useStudentActions();

  const menu = {
    items: ['active', 'paused', 'archived'].map((s) => ({
      key: s,
      label: (
        <span style={{ color: statusColors[s], fontWeight: '500' }}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </span>
      ),
    })),
    onClick: ({ key }: { key: string }) =>
      updateStudentStatus({ id: student.id, newStatus: key as StudentStatus }),
  };

  return (
    <Dropdown menu={menu} trigger={['click']}>
      <Tag
        style={{ cursor: 'pointer' }}
        color={statusColors[student.status] || 'default'}
      >
        {student.status}
      </Tag>
    </Dropdown>
  );
};
