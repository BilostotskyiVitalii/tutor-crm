import type { FC } from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const FooterComponent: FC = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      Tutor CRM ©{new Date().getFullYear()} Created with love by Vit
    </Footer>
  );
};

export default FooterComponent;
