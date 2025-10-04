import { DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Popconfirm } from 'antd';

import { StudentStatus } from '@/features/students/constants/constants';
import type { Student } from '@/features/students/types/studentTypes';

type Handlers = {
  onDelete: () => void;
  onChangeStatus: (status: boolean) => void;
};

const { active, inactive } = StudentStatus;

export function getStudentMenuItems(
  student: Student,
  { onDelete, onChangeStatus }: Handlers,
): MenuProps['items'] {
  return [
    {
      key: active,
      label: active,
      disabled: student.isActive,
      onClick: () => onChangeStatus(true),
    },
    {
      key: inactive,
      label: inactive,
      disabled: !student.isActive,
      onClick: () => onChangeStatus(false),
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
