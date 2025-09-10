import { createElement, useState, type CSSProperties, type FC } from 'react';
import { useNavigate } from 'react-router';

import {
  BarChartOutlined,
  TeamOutlined,
  SettingFilled,
  HomeOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';

import { Layout, Menu, theme } from 'antd';

const siderStyle: CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const SiderComponent: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { Sider } = Layout;

  const siderItems = [
    { title: 'Dashboard', icon: HomeOutlined, path: '/dashboard' },
    { title: 'Calendar', icon: ScheduleOutlined, path: '/calendar' },
    { title: 'Students', icon: TeamOutlined, path: '/students' },
    { title: 'Analytics', icon: BarChartOutlined, path: '/analytics' },
    { title: 'Settings', icon: SettingFilled, path: '/settings' },
  ].map((item) => ({
    key: item.title,
    icon: createElement(item.icon),
    label: item.title,
    path: item.path,
  }));

  const handleClick = (e: { key: string }) => {
    const item = siderItems.find((i) => i.key === e.key);
    if (item) {
      navigate(item.path);
    }
  };

  return (
    <Sider
      style={siderStyle}
      breakpoint="lg"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu
        theme="dark"
        mode="inline"
        items={siderItems}
        defaultSelectedKeys={['1']}
        onClick={handleClick}
      />
    </Sider>
  );
};

export default SiderComponent;
