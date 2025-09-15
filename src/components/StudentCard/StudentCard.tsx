import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Card } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import styles from './StudentCard.module.scss';

const { Meta } = Card;

const StudentCard: FC = () => {
  function addHandler() {
    console.log('ADD');
  }

  return (
    <Card
      className={styles.card}
      actions={[
        <PlusOutlined key="add" onClick={addHandler} />,
        <EditOutlined key="edit" />,
        <DeleteOutlined key="delete" className={styles.delete} />,
      ]}
    >
      <Meta
        avatar={
          <Avatar
            size={64}
            src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"
          />
        }
        title={
          <Link to={'/students/:id'}>
            <span>Name</span> <span>Surname</span>
          </Link>
        }
        description="Preparation for English B1"
      />
    </Card>
  );
};

export default StudentCard;
