import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Spin } from 'antd';

const GroupsPage = () => {
  function showCreate() {}

  return (
    <Flex vertical gap="large">
      <Space direction="vertical" size="large">
        <h1>Groups</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreate}>
          New group
        </Button>
      </Space>

      {/* <Flex wrap gap="large">
        {error && <p style={{ color: 'red' }}>Failed to load group</p>}
        {isLoading && <Spin size="large" />}
        {groups?.map((group) => (
          <GroupCard key={group.id} group={group} onEdit={showEdit} />
        ))}
      </Flex> */}
    </Flex>
  );
};

export default GroupsPage;
