import { useNavigate } from 'react-router-dom';

import { Dropdown, type MenuProps } from 'antd';

import { authApi } from '@/features/auth/api/authApi';
import { removeUser } from '@/features/auth/api/authSlice';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';
import { UserMenuCard } from '@/shared/components/UI/UserMenuCard/UserMenuCard';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useAppDispatch } from '@/store/reduxHooks';

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
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const user = authApi.endpoints.fetchProfile.useQueryState(undefined)?.data;

  const handleClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      try {
        // Очищаємо весь кеш RTK Query для авторизації та студентів
        dispatch(removeUser());
        dispatch(authApi.util.resetApiState());
        navigate('/login');
      } catch (error) {
        handleError(error, 'Logout Error');
      }
    }
  };

  return (
    <Dropdown menu={{ items, onClick: handleClick }} trigger={['click']}>
      <div className={styles.dropDownContainer}>
        <AvatarCustom
          className={styles.avatar}
          src={user?.avatar ?? null}
          name={user?.nickName ?? ''}
        />
      </div>
    </Dropdown>
  );
};
