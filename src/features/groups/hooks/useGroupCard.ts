import type { Group } from '@/features/groups/types/groupTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { useModal } from '@/shared/providers/ModalProvider';

export const useGroupCard = (group: Group) => {
  const { data: students } = useGetStudentsQuery();
  const { openModal } = useModal();

  const filteredStudents = students?.filter((student) =>
    group.studentIds.includes(student.id),
  );

  function onAddLesson() {
    openModal({
      type: 'lesson',
      mode: 'create',
      entityId: group.id,
      extra: { preGroup: group.id },
    });
  }

  function onEditGroup() {
    openModal({
      type: 'group',
      mode: 'edit',
      entityId: group.id,
    });
  }

  return {
    onAddLesson,
    onEditGroup,
    filteredStudents,
  };
};
