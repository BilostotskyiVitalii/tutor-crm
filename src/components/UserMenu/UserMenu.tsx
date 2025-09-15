import { useState, type FC } from 'react';
import { Avatar, Dropdown, type MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import UserMenuCard from '@/components/UserMenuCard/UserMenuCard';
import { removeUser } from '@/store/userSlice';
import styles from './UserMenu.module.scss';
import { useAppDispatch } from '@/hooks/reducHooks';

const items: MenuProps['items'] = [
  {
    label: <UserMenuCard />,
    key: 'user',
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
  const dispatch = useAppDispatch();

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      dispatch(removeUser());
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
