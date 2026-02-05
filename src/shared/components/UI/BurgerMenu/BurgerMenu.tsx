import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Drawer, Menu } from 'antd';

import { navItems } from '@/shared/constants/varaibles';

type BurgerMenuProps = {
  drawerVisible: boolean;
  toggleDrawer: () => void;
  setDrawerVisible: (isDrawerVisible: boolean) => void;
};

const BurgerMenu: FC<BurgerMenuProps> = ({
  drawerVisible,
  toggleDrawer,
  setDrawerVisible,
}) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const burgerItems = navItems.map(({ titleKey, icon, path }) => ({
    key: path,
    icon: icon && React.createElement(icon),
    label: t(titleKey),
  }));

  return (
    <Drawer
      title="Menu"
      placement="left"
      onClose={toggleDrawer}
      open={drawerVisible}
    >
      <Menu
        mode="inline"
        onClick={({ key }) => {
          navigate(key);
          setDrawerVisible(false);
        }}
        items={burgerItems}
      />
    </Drawer>
  );
};

export default BurgerMenu;
