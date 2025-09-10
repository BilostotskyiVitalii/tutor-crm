import React, {
  createElement,
  useState,
  type CSSProperties,
  type FC,
} from 'react';

import {
  BarChartOutlined,
  TeamOutlined,
  UserOutlined,
  SettingFilled,
  HomeOutlined,
  ScheduleOutlined,
  MailOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

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

const siderItems: MenuProps['items'] = [
  { title: 'Dashboard', icon: HomeOutlined },
  { title: 'Calendar', icon: ScheduleOutlined },
  { title: 'Students', icon: TeamOutlined },
  { title: 'Analytics', icon: BarChartOutlined },
  { title: 'Settings', icon: SettingFilled },
].map((item, index) => ({
  key: String(index + 1),
  icon: createElement(item.icon),
  label: item.title,
}));

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

const App: FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout hasSider>
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
        />
      </Sider>
      <Layout>
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
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <p>long content</p>
            {
              // indicates very long content
              Array.from({ length: 100 }, (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? 'more' : '...'}
                  <br />
                </React.Fragment>
              ))
            }
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Tutor CRM ©{new Date().getFullYear()} Created with love by Vit
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
