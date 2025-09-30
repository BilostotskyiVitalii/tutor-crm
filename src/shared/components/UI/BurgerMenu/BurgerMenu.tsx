import type { FC } from 'react';
import React from 'react';
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

  const burgerItems = navItems.map(({ title, icon, path }) => ({
    key: path,
    icon: icon && React.createElement(icon),
    label: title,
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
