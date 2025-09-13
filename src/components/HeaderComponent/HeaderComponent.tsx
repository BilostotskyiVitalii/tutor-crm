import { type FC } from 'react';
import { Layout, Space } from 'antd';

import { SelectLang, LogoComponent, UserMenu } from '@/components';

import styles from './HeaderComponent.module.scss';

const { Header } = Layout;

const HeaderComponent: FC = () => {
  return (
    <Header className={styles.header}>
      <LogoComponent />
      <Space>
        <SelectLang />
        <UserMenu />
      </Space>
    </Header>
  );
};

export default HeaderComponent;
