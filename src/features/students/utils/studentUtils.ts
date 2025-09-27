import type { StudentStatus } from '@/features/students/types/studentTypes';

export const getRibbonProps = (status: StudentStatus) => {
  switch (status) {
    case 'active':
      return { text: 'Active', color: 'green' };
    case 'paused':
      return { text: 'Paused', color: 'orange' };
    case 'archived':
      return { text: 'Archived', color: 'gray' };
    default:
      return { text: '', color: 'gray' };
  }
};
