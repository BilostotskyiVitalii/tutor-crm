import { useFetchProfileQuery } from '@/features/auth/api/authApi';

import styles from './UserMenuCard.module.scss';

export const UserMenuCard = () => {
  const { data: user } = useFetchProfileQuery();

  return (
    <div className={styles.wrapper}>
      <p className={styles.nickname}>{user?.nickName}</p>
      <p>{user?.email}</p>
    </div>
  );
};
