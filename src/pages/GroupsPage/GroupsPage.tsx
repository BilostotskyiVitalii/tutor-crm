import { useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Spin } from 'antd';

import { GroupCard } from '@/components';
import GroupForm from '@/components/GroupForm/GroupForm';
import { useGetGroupsQuery } from '@/store/groupsApi';
import type { Group } from '@/types/groupTypes';

const GroupsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedGroup, setEditedGroup] = useState<Group | null>(null);
  const { data: groups, isLoading, isError } = useGetGroupsQuery();

  function showCreate() {
    setIsModalOpen(true);
    setEditedGroup(null);
  }

  function onClose() {
    setIsModalOpen(false);
    setEditedGroup(null);
  }

  const onEditEdit = (group: Group) => {
    setEditedGroup(group);
    setIsModalOpen(true);
  };

  return (
    <Flex vertical gap="large">
      <Space direction="vertical" size="large">
        <h1>Groups</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreate}>
          New group
        </Button>
      </Space>

      <Flex wrap gap="large">
        {isError && <p style={{ color: 'red' }}>Failed to load group</p>}
        {isLoading && <Spin size="large" />}
        {groups?.map((group) => (
          <GroupCard key={group.id} group={group} onEdit={onEditEdit} />
        ))}
      </Flex>
      <GroupForm
        isModalOpen={isModalOpen}
        onClose={onClose}
        editedGroup={editedGroup}
      />
    </Flex>
  );
};

export default GroupsPage;
