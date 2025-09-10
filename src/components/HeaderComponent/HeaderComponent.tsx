import type { FC } from 'react';
import { Avatar, Layout } from 'antd';
import { UserOutlined, PaperClipOutlined } from '@ant-design/icons';

import styles from './HeaderComponent.module.scss';

const { Header } = Layout;

const HeaderComponent: FC = () => {
  return (
    <Header className={styles.header}>
      <div className={styles.logo}>
        Clips CRM
        <PaperClipOutlined />
      </div>
      <div>
        LOGOUT
        <Avatar
          style={{ backgroundColor: '#8062b1ff', verticalAlign: 'middle' }}
          icon={<UserOutlined />}
        />
      </div>
    </Header>
  );
};

export default HeaderComponent;
