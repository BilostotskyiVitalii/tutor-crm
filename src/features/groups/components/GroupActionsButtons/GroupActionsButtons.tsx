import type { FC } from 'react';

import { Button, Space } from 'antd';

import { useGroupActions } from '@/features/groups/hooks/useGroupActions';
import type { Group } from '@/features/groups/types/groupTypes';
import { useModal } from '@/shared/providers/ModalProvider';

interface GroupActionsProps {
  group: Group;
}

export const GroupActionsButtons: FC<GroupActionsProps> = ({ group }) => {
  const { removeGroup } = useGroupActions();
  const { openModal } = useModal();

  function onEditGroup() {
    openModal({
      type: 'group',
      mode: 'edit',
      entity: group,
    });
  }

  function onCreateLesson() {
    openModal({
      type: 'lesson',
      mode: 'create',
      initData: { initGroup: group },
      entity: null,
    });
  }

  function onDeleteGroup() {
    removeGroup(group.id);
  }

  return (
    <Space>
      <Button onClick={onEditGroup} size="small">
        Edit
      </Button>
      <Button onClick={onCreateLesson} size="small">
        Add Lesson
      </Button>
      <Button onClick={onDeleteGroup} size="small" danger>
        Delete
      </Button>
    </Space>
  );
};
