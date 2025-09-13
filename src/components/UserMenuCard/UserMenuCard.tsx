import type { FC } from 'react';
import styles from './UserMenuCard.module.scss';

const UserMenuCard: FC = () => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.nickname}>Valeriia Bilostotska</p>
      <p>valeriia.bilostotska@gmail.com</p>
    </div>
  );
};

export default UserMenuCard;
