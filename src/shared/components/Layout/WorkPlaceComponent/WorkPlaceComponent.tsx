import { useEffect, useState } from 'react';

import { Layout } from 'antd';

import AppRoutes from '@/routes/AppRoutes/AppRoutes';
import FooterComponent from '@/shared/components/Layout/FooterComponent/FooterComponent';
import HeaderComponent from '@/shared/components/Layout/HeaderComponent/HeaderComponent';
import SiderComponent from '@/shared/components/Layout/SiderComponent/SiderComponent';
import BurgerMenu from '@/shared/components/UI/BurgerMenu/BurgerMenu';

const WorkPlaceComponent = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  return (
    <Layout>
      <HeaderComponent onBurgerClick={toggleDrawer} isMobile={isMobile} />
      <Layout hasSider>
        {!isMobile && <SiderComponent />}
        {isMobile && (
          <BurgerMenu
            drawerVisible={drawerVisible}
            setDrawerVisible={setDrawerVisible}
            toggleDrawer={toggleDrawer}
          />
        )}
        <Layout>
          <AppRoutes />
          <FooterComponent />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default WorkPlaceComponent;
