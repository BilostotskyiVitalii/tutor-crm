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
    <Layout>
      <HeaderComponent />
      <Layout hasSider>
        <SiderComponent />
        <Layout>
          <AppRoutes />
          <FooterComponent />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
