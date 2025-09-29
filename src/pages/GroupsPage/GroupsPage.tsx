import { useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Spin } from 'antd';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import GroupCard from '@/features/groups/components/GroupCard/GroupCard';
import GroupForm from '@/features/groups/components/GroupForm/GroupForm';
import type { Group, ModalState } from '@/features/groups/types/groupTypes';
import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';

const GroupsPage = () => {
  const { data: groups, isLoading, isError } = useGetGroupsQuery();
  const [modalState, setModalState] = useState<ModalState>(null);

  const openGroupModal = (group: Group | null = null) => {
    setModalState({ type: 'group', group });
  };

  const openLessonModal = (group: Group) => {
    setModalState({ type: 'lesson', group });
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
            onEdit={() => openGroupModal(group)}
            onAddLesson={() => openLessonModal(group)}
          />
        ))}
      </Flex>
      {modalState?.type === 'group' && (
        <GroupForm
          isModalOpen
          onClose={closeModal}
          editedGroup={modalState.group}
        />
      )}
      {modalState?.type === 'lesson' && (
        <LessonFormModal
          isModalOpen
          onClose={closeModal}
          defaultStudents={modalState.group.studentIds}
          defaultGroup={modalState.group}
        />
      )}
    </Flex>
  );
};

export default GroupsPage;
