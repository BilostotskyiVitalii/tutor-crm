import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Spin } from 'antd';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import GroupCard from '@/features/groups/components/GroupCard/GroupCard';
import { useModal } from '@/shared/providers/ModalProvider';

import styles from './GroupsPage.module.scss';

const GroupsPage = () => {
  const { data: groups, isLoading, isError } = useGetGroupsQuery();
  const { openModal } = useModal();

  function onAddGroup() {
    openModal({
      type: 'group',
      mode: 'create',
    });
  }

  return (
    <Flex vertical gap="large" className={styles.wrapper}>
      <Button
        className={styles.addButton}
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddGroup}
      >
        New group
      </Button>

      {isError && <p style={{ color: 'red' }}>Failed to load group</p>}
      {groups?.length === 0 && <Empty description={'No groups found'} />}

      <Spin
        spinning={isLoading}
        size="large"
        tip="Loading groups..."
        wrapperClassName={styles.groupsWrapper}
      >
        <Flex wrap gap="large">
          {groups?.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </Flex>
      </Spin>
    </Flex>
  );
};

export default GroupsPage;
