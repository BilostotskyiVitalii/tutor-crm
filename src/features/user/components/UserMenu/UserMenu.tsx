import { type FC, useState } from 'react';

import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, type MenuProps } from 'antd';
import { getAuth, signOut } from 'firebase/auth';

import { studentsApi } from '@/features/students/api/studentsApi';
import { removeUser } from '@/features/user/api/userSlice';
import UserMenuCard from '@/features/user/components/UserMenuCard/UserMenuCard';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { getAvatarColorClass } from '@/shared/utils/getAvatarColorClass';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';

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
  const avatar = useAppSelector((state) => state.user.avatar);
  const userName = useAppSelector((state) => state.user.nickName);
  const auth = getAuth();
  const { handleError } = useErrorHandler();

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  const handleClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      try {
        await signOut(auth);
        dispatch(removeUser());
        dispatch(studentsApi.util.resetApiState());
      } catch (error) {
        handleError(error, 'logout Error');
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
        className={`${styles.avatar} ${styles[getAvatarColorClass(userName ?? '')]} ${isOpen ? styles.openMenu : ''}`}
        src={avatar ?? undefined}
        icon={<UserOutlined />}
        onError={() => true}
      />
    </Dropdown>
  );
};

export default UserMenu;
