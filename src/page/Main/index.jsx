import React, { useState } from 'react';
import { UploadOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { Layout, Menu, Dropdown, Avatar, Space, theme } from 'antd';
import Target from "../../component/Target";
import Conclusion from "../../component/Conclusion";
import TargetItemContainer from "../../component/TargetItemContainer";

const { Content, Footer, Sider } = Layout;

const items = [
    {
        key: '1',
        icon: <UserOutlined />,
        label: 'Targets',
    },
    {
        key: '2',
        icon: <UploadOutlined />,
        label: 'Target Config',
    },
    {
        key: '3',
        icon: <UploadOutlined />,
        label: 'Conclusion',
    }
];

const menu = (
    <Menu>
        <Menu.Item key="editProfile">编辑个人资料</Menu.Item>
        <Menu.Item key="logout">退出登录</Menu.Item>
    </Menu>
);

const Main = () => {
    const [selectedKey, setSelectedKey] = useState('1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleMenuClick = ({ key }) => {
        if (key === "editProfile") {
            console.log("Edit Profile");
            // 这里可以添加跳转到编辑个人资料页面的逻辑
        } else if (key === "logout") {
            console.log("Logout");
            // 这里可以添加登出逻辑
        }
    };

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return <TargetItemContainer />;
            case '2':
                return <Target />;
            case '3':
                return <Conclusion />;
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} onClick={({ key }) => setSelectedKey(key)} />
            </Sider>
            <Layout>
                <Content
                    style={{
                        margin: '24px 16px 0',
                        minHeight: 'calc(100vh - 100px)'
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {renderContent()}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Welcome to use check_in app !
                </Footer>
                {/* 用户头像 */}
                <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Space direction="horizontal">
                            <Avatar size="large" icon={<UserOutlined />} />
                            <DownOutlined />
                        </Space>
                    </Dropdown>
                </div>
            </Layout>
        </Layout>
    );
};

export default Main;