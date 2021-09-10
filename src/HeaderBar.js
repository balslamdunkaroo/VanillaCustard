import React from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { Header} = Layout;

function HeaderBar() {

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div>{}
        </div>
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={["home"]}>
            <Menu.Item style={{"background": "#702963"}} key="home" icon={<SafetyCertificateOutlined />}>Vanilla Custard: Safe for VYou </Menu.Item>
        </Menu>
    </Header>
  );
}

export default HeaderBar;