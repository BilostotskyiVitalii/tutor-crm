import { createElement, useState, type FC } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  BarChartOutlined,
  TeamOutlined,
  SettingFilled,
  HomeOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, type MenuProps } from 'antd';

import { navigationUrls } from '@/constants/navigationUrls';

import styles from './SiderComponent.module.scss';

const SiderComponent: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { Sider } = Layout;
  const { dashboard, students, calendar, settings, analytics } = navigationUrls;

  const siderItems: MenuProps['items'] = [
    { title: 'Dashboard', icon: HomeOutlined, path: dashboard },
    { title: 'Calendar', icon: ScheduleOutlined, path: calendar },
    { title: 'Students', icon: TeamOutlined, path: students },
    { title: 'Analytics', icon: BarChartOutlined, path: analytics },
    { title: 'Settings', icon: SettingFilled, path: settings },
  ].map((item) => ({
    key: item.path,
    icon: createElement(item.icon),
    label: item.title,
  }));

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
        selectedKeys={[location.pathname.toLowerCase()]}
      />
    </Sider>
  );
};

export default SiderComponent;
