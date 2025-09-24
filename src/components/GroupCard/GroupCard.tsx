import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Card, notification, Popconfirm, Tooltip } from 'antd';

import { LessonFormModal } from '@/components';
import { navigationUrls } from '@/constants/navigationUrls';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useDeleteGroupMutation } from '@/store/groupsApi';
import { useGetStudentsQuery } from '@/store/studentsApi';
import type { Group } from '@/types/groupTypes';

import styles from './GroupCard.module.scss';

const { Meta } = Card;

interface GroupCardProps {
  group: Group;
  onEdit: (lesson: Group) => void;
}

const GroupCard: FC<GroupCardProps> = ({ group, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();
  const tutorId = useAppSelector((state) => state.user.id);
  const {
    data: students,
    isLoading,
    error,
  } = useGetStudentsQuery(tutorId ?? '');

  const filteredStudents = students?.filter((student) =>
    group.studentIds.includes(student.id),
  );

  async function removeHandler() {
    try {
      await deleteGroup(group.id).unwrap();
      notification.success({
        message: 'Group deleted!',
      });
    } catch {
      notification.error({
        message: 'Failed to delete group',
      });
    }
  }

  function onClose() {
    setIsModalOpen(false);
  }

  return (
    <>
      <Card
        loading={isDeleting}
        className={styles.card}
        actions={[
          <PlusOutlined key="add" onClick={() => setIsModalOpen(true)} />,
          <EditOutlined key="edit" onClick={() => onEdit(group)} />,
          <Popconfirm
            title="Delete this group?"
            okText="Yes"
            cancelText="No"
            onConfirm={removeHandler}
          >
            <DeleteOutlined key="delete" className={styles.delete} />
          </Popconfirm>,
        ]}
      >
        <Meta
          avatar={
            <Avatar.Group
              size={64}
              max={{
                count: 3,
                style: {
                  color: '#f56a00',
                  backgroundColor: '#fde3cf',
                  cursor: 'pointer',
                },
              }}
            >
              {filteredStudents?.map((student) => (
                <Tooltip key={student.id} title={student.name} placement="top">
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${student.id}`}
                  />
                </Tooltip>
              ))}
            </Avatar.Group>
          }
          title={
            <Link to={`${navigationUrls.groups}/${group.id}`}>
              <span>{group.title}</span>
            </Link>
          }
          description={<p>{group.notes}</p>}
        />
      </Card>
      <LessonFormModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        defaultStudents={group.studentIds}
      />
    </>
  );
};

export default GroupCard;
