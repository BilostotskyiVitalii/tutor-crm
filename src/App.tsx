import React, { type FC } from 'react';

import { UserOutlined, MailOutlined } from '@ant-design/icons';

import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import SiderComponent from './components/SiderComponent/SiderComponent';

const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

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

  return (
    <Layout hasSider>
      <SiderComponent />
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
