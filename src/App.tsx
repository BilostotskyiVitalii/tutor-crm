import { type FC } from 'react';
import { Layout } from 'antd';

import {
  AppRoutes,
  SiderComponent,
  HeaderComponent,
  FooterComponent,
} from '@/components';

const App: FC = () => {
  return (
    <Layout hasSider>
      <SiderComponent />
      <Layout>
        <HeaderComponent />
        <AppRoutes />
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default App;
