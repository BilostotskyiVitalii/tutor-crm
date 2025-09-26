import { Layout } from 'antd';

import AppRoutes from '@/routes/AppRoutes/AppRoutes';
import FooterComponent from '@/shared/components/Layout/FooterComponent/FooterComponent';
import HeaderComponent from '@/shared/components/Layout/HeaderComponent/HeaderComponent';
import SiderComponent from '@/shared/components/Layout/SiderComponent/SiderComponent';

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
