import React from 'react';

import { Layout } from 'antd';

import { AppRoutes } from '@/routes/AppRoutes/AppRoutes';
import FooterComponent from '@/shared/components/Layout/FooterComponent/FooterComponent';
import HeaderComponent from '@/shared/components/Layout/HeaderComponent/HeaderComponent';
import SiderComponent from '@/shared/components/Layout/SiderComponent/SiderComponent';
import BurgerMenu from '@/shared/components/UI/BurgerMenu/BurgerMenu';
import { useIsMobile } from '@/shared/hooks/useIsMobile';

export const MainLayout = () => {
  const isMobile = useIsMobile();
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const toggleDrawer = () => setDrawerVisible((s) => !s);

  return (
    <Layout>
      <HeaderComponent onBurgerClick={toggleDrawer} isMobile={isMobile} />
      <Layout hasSider>
        {!isMobile && <SiderComponent />}
        {isMobile && (
          <BurgerMenu
            setDrawerVisible={setDrawerVisible}
            drawerVisible={drawerVisible}
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
