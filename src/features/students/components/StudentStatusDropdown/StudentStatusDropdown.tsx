import type { FC } from 'react';

import { Dropdown, Tag } from 'antd';

import { StudentStatus } from '@/features/students/constants/constants';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import { type Student } from '@/features/students/types/studentTypes';

import styles from './StudentStatusDropdown.module.scss';

const { active, inactive } = StudentStatus;

export const StatusDropdown: FC<{ student: Student }> = ({ student }) => {
  const { updateStudentStatus } = useStudentActions();

  const menu = {
    items: Object.values(StudentStatus).map((menuItem) => ({
      key: menuItem,
      label: menuItem,
      disabled:
        (menuItem === StudentStatus.active && student.isActive) ||
        (menuItem === StudentStatus.inactive && !student.isActive),
    })),
    onClick: ({ key }: { key: string }) =>
      updateStudentStatus({
        id: student.id,
        newStatus: key === active,
      }),
  };

  return (
    <Dropdown menu={menu} trigger={['click']}>
      <Tag className={styles.tag} color={student.isActive ? 'green' : 'grey'}>
        {student.isActive ? active : inactive}
      </Tag>
    </Dropdown>
  );
};
