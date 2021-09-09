import React from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { HomeOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { Header} = Layout;

function HeaderBar() {

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div>{}
        </div>
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={["home"]}>
            <Menu.Item key="home" icon={<HomeOutlined />}>Home</Menu.Item>
        </Menu>
    </Header>
  );
}

export default HeaderBar;