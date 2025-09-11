import { Layout } from 'antd';

import {
  AppRoutes,
  SiderComponent,
  HeaderComponent,
  FooterComponent,
} from '@/components';

const WorkPlaceComponent = () => {
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

export default WorkPlaceComponent;
