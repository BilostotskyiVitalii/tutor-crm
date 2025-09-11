import type { FC } from 'react';
import { Avatar, Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import LogoComponent from '@/components/LogoComponent/LogoComponent';

import styles from './HeaderComponent.module.scss';

const { Header } = Layout;

const HeaderComponent: FC = () => {
  return (
    <Header className={styles.header}>
      <LogoComponent />
      <div>
        <span>LOGOUT</span>
        <Avatar
          style={{ backgroundColor: '#8062b1ff', verticalAlign: 'middle' }}
          icon={<UserOutlined />}
        />
      </div>
    </Header>
  );
};

export default HeaderComponent;
