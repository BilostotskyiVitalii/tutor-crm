import { Dropdown, type MenuProps } from 'antd';
import { getAuth, signOut } from 'firebase/auth';

import { studentsApi } from '@/features/students/api/studentsApi';
import { removeUser } from '@/features/user/api/userSlice';
import { UserMenuCard } from '@/features/user/components/UserMenuCard/UserMenuCard';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
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

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const avatar = useAppSelector((state) => state.user.avatar);
  const userName = useAppSelector((state) => state.user.nickName);
  const auth = getAuth();
  const { handleError } = useErrorHandler();

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
    <Dropdown menu={{ items, onClick: handleClick }} trigger={['click']}>
      <div className={styles.dropDownContainer}>
        <AvatarCustom
          className={styles.avatar}
          src={avatar}
          name={userName ?? ''}
        />
      </div>
    </Dropdown>
  );
};
