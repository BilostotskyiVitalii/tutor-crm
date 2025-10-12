import { createElement, type FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Layout, Menu } from 'antd';

import { navItems } from '@/shared/constants/varaibles';

import styles from './SiderComponent.module.scss';

const SiderComponent: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { Sider } = Layout;

  const siderItems = navItems.map((item) => ({
    key: item.path,
    icon: createElement(item.icon),
    label: item.title,
  }));

  const selectedItem = siderItems.find((item) =>
    location.pathname.toLowerCase().startsWith(String(item?.key).toLowerCase()),
  );

  const selectedKey: string[] = selectedItem?.key
    ? [String(selectedItem.key)]
    : [];

  return (
    <Sider
      className={styles.sider}
      breakpoint="lg"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu
        theme="dark"
        className={styles.menu}
        mode="inline"
        items={siderItems}
        onClick={({ key }) => navigate(key)}
        selectedKeys={selectedKey}
      />
    </Sider>
  );
};

export default SiderComponent;
