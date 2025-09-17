import { useState, type FC } from 'react';
import { Avatar, Dropdown, type MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getAuth, signOut } from 'firebase/auth';

import { removeUser } from '@/store/userSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import UserMenuCard from '@/components/UserMenuCard/UserMenuCard';

import styles from './UserMenu.module.scss';

const items: MenuProps['items'] = [
  {
    label: (
      <div className={styles.userMenuCardWrapper}>
        <UserMenuCard />
      </div>
    ),
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
  const { profile } = useAuthProfile();
  const auth = getAuth();

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  const handleClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
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
        src={profile?.avatar ?? undefined}
        icon={!profile?.avatar ? <UserOutlined /> : undefined}
      />
    </Dropdown>
  );
};

export default UserMenu;
