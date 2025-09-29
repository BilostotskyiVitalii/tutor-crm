import type { FC } from 'react';

import { Dropdown, Tag } from 'antd';

import { useUpdateStudentMutation } from '@/features/students/api/studentsApi';
import type {
  Student,
  StudentStatus,
} from '@/features/students/types/studentTypes';

const statusColors: Record<string, string> = {
  active: 'green',
  paused: 'orange',
  archived: 'gray',
};

const getStatusTag = (status: string) => (
  <Tag color={statusColors[status] || 'default'}>{status}</Tag>
);

export const StatusDropdown: FC<{ student: Student }> = ({ student }) => {
  const [updateStudent] = useUpdateStudentMutation();
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
      updateStudent({
        id: student.id,
        data: { status: key as StudentStatus },
      }),
  };

  return (
    <Dropdown menu={menu} trigger={['click']}>
      <div style={{ cursor: 'pointer' }}>{getStatusTag(student.status)}</div>
    </Dropdown>
  );
};
