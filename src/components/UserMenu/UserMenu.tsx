import { useState, type FC } from 'react';
import { Avatar, Dropdown, type MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import UserMenuCard from '@/components/UserMenuCard/UserMenuCard';

import styles from './UserMenu.module.scss';

const items: MenuProps['items'] = [
  {
    label: <UserMenuCard />,
    key: '0',
    className: styles.noHover,
  },
  {
    type: 'divider',
  },
  {
    label: 'Log out',
    key: 'logout',
    className: styles.logout,
  },
];

const UserMenu: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      console.log('Выходим из аккаунта');
    }
  };

  return (
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
  );
};

export default UserMenu;
