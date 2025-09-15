import type { FC } from 'react';
import { useAuth } from '@/hooks/useAuth';
import styles from './UserMenuCard.module.scss';

const UserMenuCard: FC = () => {
  const { email } = useAuth();
  return (
    <div className={styles.wrapper}>
      <p className={styles.nickname}>Valeriia Bilostotska</p>
      <p>{email}</p>
    </div>
  );
};

export default UserMenuCard;
