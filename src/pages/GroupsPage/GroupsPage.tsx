import { useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Space, Spin } from 'antd';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import GroupCard from '@/features/groups/components/GroupCard/GroupCard';
import type { ModalState } from '@/features/groups/types/groupTypes';
import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import { useModal } from '@/shared/providers/ModalProvider';

const GroupsPage = () => {
  const { data: groups, isLoading, isError } = useGetGroupsQuery();
  const [modalState, setModalState] = useState<ModalState>(null);

  const openLessonModal = (groupId: string) => {
    setModalState({ type: 'lesson', groupId });
  };

  const closeModal = () => setModalState(null);

  const { openModal } = useModal();

  return (
    <Flex vertical gap="large">
      <Space direction="vertical" size="large">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() =>
            openModal({
              type: 'group',
              mode: 'create',
            })
          }
        >
          New group
        </Button>
      </Space>

      {groups?.length === 0 && <Empty description={'No groups found'} />}
      {isLoading && <Spin size="large" />}
      {isError && <p style={{ color: 'red' }}>Failed to load group</p>}

      <Flex wrap gap="large">
        {groups?.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onAddLesson={() => openLessonModal(group.id)}
          />
        ))}
      </Flex>

      {modalState?.type === 'lesson' && (
        <LessonFormModal
          isModalOpen
          onClose={closeModal}
          defaultGroup={modalState.groupId}
        />
      )}
    </Flex>
  );
};

export default GroupsPage;
