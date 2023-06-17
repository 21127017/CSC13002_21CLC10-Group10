import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Register from './page/Register';

const { Header, Content, Footer, Sider } = Layout;

const items1: MenuProps['items'] = ['Home', 'Login', 'Logout'].map((key) => ({
  key,
  label: `${key}`,
}));

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
      </Header>
      <Content style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
            <Register/>
      </Content>
      <Footer style={{ textAlign: 'center'}}>InvestingHub ©2023 Created by Group 10</Footer>
    </Layout>
  );
};

export default App;