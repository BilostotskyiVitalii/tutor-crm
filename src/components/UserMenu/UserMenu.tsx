import { useState, type FC } from 'react';
import { Avatar, Dropdown, type MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getAuth, signOut } from 'firebase/auth';

import { removeUser } from '@/store/userSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';
import UserMenuCard from '@/components/UserMenuCard/UserMenuCard';

import styles from './UserMenu.module.scss';

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

  const handleClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      const auth = getAuth();
      try {
        await signOut(auth);
        dispatch(removeUser());
      } catch (error) {
        console.error('Ошибка при выходе:', error);
      }
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
