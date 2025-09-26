import { type FC } from 'react';

import { Layout, Space } from 'antd';

import UserMenu from '@/features/user/UserMenu/UserMenu';
import LogoComponent from '@/shared/components/Layout/LogoComponent/LogoComponent';
import SelectLang from '@/shared/components/UI/SelectLang/SelectLang';

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
