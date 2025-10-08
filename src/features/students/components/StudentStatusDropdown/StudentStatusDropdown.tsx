import type { FC } from 'react';

import { Dropdown, Tag } from 'antd';

import { studentStatus } from '@/features/students/constants/constants';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import { type Student } from '@/features/students/types/studentTypes';

import styles from './StudentStatusDropdown.module.scss';

const { active, inactive } = studentStatus;

export const StatusDropdown: FC<{ student: Student }> = ({ student }) => {
  const { updateStudentStatus } = useStudentActions();

  const menu = {
    items: Object.values(studentStatus).map((menuItem) => ({
      key: menuItem,
      label: menuItem,
      disabled:
        (menuItem === active && student.isActive) ||
        (menuItem === inactive && !student.isActive),
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
