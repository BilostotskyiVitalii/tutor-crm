import { useTranslation } from 'react-i18next';

import { Dropdown, type MenuProps } from 'antd';

import { useFetchProfileQuery } from '@/features/auth/api/authApi';
import { useLogout } from '@/features/auth/hooks/useLogout';
import AvatarCustom from '@/shared/components/UI/AvatarCustom/AvatarCustom';
import { UserMenuCard } from '@/shared/components/UI/UserMenuCard/UserMenuCard';

import styles from './UserMenu.module.scss';

export const UserMenu = () => {
  const { data: user } = useFetchProfileQuery();
  const { onLogout } = useLogout();
  const { t } = useTranslation();

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
      label: t('userMenu.logout'),
      key: 'logout',
      className: styles.logout,
    },
  ];

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      onLogout();
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
