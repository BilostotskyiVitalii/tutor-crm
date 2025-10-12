import type { FC } from 'react';

import { Layout } from 'antd';

const { Footer } = Layout;

import styles from './FooterComponent.module.scss';

const FooterComponent: FC = () => {
  return (
    <Footer className={styles.footer}>
      Tutor CRM ©{new Date().getFullYear()} Created with love by Vit
    </Footer>
  );
};

export default FooterComponent;
