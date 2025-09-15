import { Layout } from 'antd';
import { SiderComponent, HeaderComponent, FooterComponent } from '@/components';
import AppRoutes from '@/routes/AppRoutes/AppRoutes';

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
