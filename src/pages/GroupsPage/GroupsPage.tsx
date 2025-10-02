import { useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Spin } from 'antd';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import GroupCard from '@/features/groups/components/GroupCard/GroupCard';
import GroupForm from '@/features/groups/components/GroupForm/GroupForm';
import type { ModalState } from '@/features/groups/types/groupTypes';
import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';

const GroupsPage = () => {
  const { data: groups, isLoading, isError } = useGetGroupsQuery();
  const [modalState, setModalState] = useState<ModalState>(null);

  const openGroupModal = (groupId: string | null = null) => {
    setModalState({ type: 'group', groupId });
  };

  const openLessonModal = (groupId: string) => {
    setModalState({ type: 'lesson', groupId });
  };

  const closeModal = () => setModalState(null);

  return (
    <Flex vertical gap="large">
      <Space direction="vertical" size="large">
        <h1>Groups</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openGroupModal()}
        >
          New group
        </Button>
      </Space>
      <Flex wrap gap="large">
        {isError && <p style={{ color: 'red' }}>Failed to load group</p>}
        {isLoading && <Spin size="large" />}
        {groups?.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onEdit={() => openGroupModal(group.id)}
            onAddLesson={() => openLessonModal(group.id)}
          />
        ))}
      </Flex>
      {modalState?.type === 'group' && (
        <GroupForm
          isModalOpen
          onClose={closeModal}
          editedGroupId={modalState.groupId}
        />
      )}
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
