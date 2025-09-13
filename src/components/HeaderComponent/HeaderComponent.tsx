import { useState, type FC } from 'react';
import { Avatar, Dropdown, Layout, Space, type MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { SelectLang, LogoComponent } from '@/components';

import styles from './HeaderComponent.module.scss';

const { Header } = Layout;

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '0',
  },
  {
    type: 'divider',
  },
  {
    label: 'Log out',
    key: 'logout',
  },
];

const HeaderComponent: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      console.log('Выходим из аккаунта');
    }
  };

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  return (
    <Header className={styles.header}>
      <LogoComponent />
      <Space>
        <SelectLang />
        <Dropdown
          menu={{ items, onClick: handleClick }}
          trigger={['click']}
          onOpenChange={handleOpenChange}
        >
          <Avatar
            className={`${styles.avatar} ${isOpen ? styles.openMenu : ''}`}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderComponent;
