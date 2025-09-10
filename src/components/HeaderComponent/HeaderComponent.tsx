import type { FC } from 'react';
import { Layout, Menu, theme } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';

import type { MenuProps } from 'antd';

const { Header } = Layout;

const headerItems: MenuItem[] = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: <MailOutlined />,
  },
  {
    label: 'UserName',
    key: 'user',
    icon: <UserOutlined />,
  },
];

type MenuItem = Required<MenuProps>['items'][number];

const HeaderComponent: FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        items={headerItems}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  );
};

export default HeaderComponent;
