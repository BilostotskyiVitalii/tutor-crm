import { DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Popconfirm } from 'antd';

import type {
  Student,
  StudentStatus,
} from '@/features/students/types/studentTypes';

type Handlers = {
  onDelete: () => void;
  onChangeStatus: (status: StudentStatus) => void;
};

export function getStudentMenuItems(
  student: Student,
  { onDelete, onChangeStatus }: Handlers,
): MenuProps['items'] {
  return [
    {
      key: 'active',
      label: 'Active',
      disabled: student.status === 'active',
      onClick: () => onChangeStatus('active'),
    },
    {
      key: 'paused',
      label: 'Pause',
      disabled: student.status === 'paused',
      onClick: () => onChangeStatus('paused'),
    },
    {
      key: 'archive',
      label: 'Archived',
      disabled: student.status === 'archived',
      onClick: () => onChangeStatus('archived'),
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: (
        <Popconfirm
          title="Delete this student?"
          okText="Yes"
          cancelText="No"
          onConfirm={onDelete}
        >
          <span>Delete</span>
        </Popconfirm>
      ),
      danger: true,
      icon: <DeleteOutlined />,
    },
  ];
}
