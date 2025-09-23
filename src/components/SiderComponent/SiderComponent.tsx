import { createElement, type FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  BarChartOutlined,
  HomeOutlined,
  ScheduleOutlined,
  SettingFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, type MenuProps } from 'antd';

import { navigationUrls } from '@/constants/navigationUrls';

import styles from './SiderComponent.module.scss';

const SiderComponent: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { Sider } = Layout;
  const { dashboard, students, schedule, settings, analytics, groups } =
    navigationUrls;

  const siderItems: MenuProps['items'] = [
    { title: 'Dashboard', icon: HomeOutlined, path: dashboard },
    { title: 'Schedule', icon: ScheduleOutlined, path: schedule },
    { title: 'Students', icon: UserOutlined, path: students },
    { title: 'Groups', icon: TeamOutlined, path: groups },
    { title: 'Analytics', icon: BarChartOutlined, path: analytics },
    { title: 'Settings', icon: SettingFilled, path: settings },
  ].map((item) => ({
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
        mode="inline"
        items={siderItems}
        onClick={({ key }) => navigate(key)}
        selectedKeys={selectedKey}
      />
    </Sider>
  );
};

export default SiderComponent;
