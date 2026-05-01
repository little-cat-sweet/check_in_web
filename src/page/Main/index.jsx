import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    PieChartOutlined,
    LineChartOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    Dropdown,
    Avatar,
    Space,
    theme,
    message
} from 'antd';

import Target from "../../component/Target";
import Conclusion from "../../component/Conclusion";
import TargetItemContainer from "../../component/TargetItemContainer";
import ProfileMenu from "../../component/ProfileMenu";
import CustomFooter from "../../component/CustomFooter"

const { Content, Footer } = Layout;

const Main = () => {
    const [selectedKey, setSelectedKey] = useState('1');
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/editProfile');
    };

    const handleLogout = () => {
        message.info("logout");
        localStorage.removeItem("authorization");
        navigate('/login');
    };

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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

    const menuItems = [
        {
            key: '1',
            icon: <LineChartOutlined />,
            label: '每日目标',
        },
        {
            key: '2',
            icon: <BarChartOutlined />,
            label: '目标',
        },
        {
            key: '3',
            icon: <PieChartOutlined />,
            label: '总结',
        }
    ];

    return (
        <>
            <style jsx global>{`
              .ant-menu-horizontal > .ant-menu-item-selected .ant-menu-overflow-item{
                color: #000 !important;
              }
              .ant-menu-horizontal > .ant-menu-item-selected::after {
                border-bottom-color: #000 !important;
              }
              .ant-menu-horizontal > .ant-menu-item:hover::after {
                border-bottom-color: #000 !important;
              }
              .ant-menu-horizontal > .ant-menu-item:hover {
                color: #000 !important;
              }
              .ant-menu-horizontal > .ant-menu-item-selected .anticon {
                color: #000 !important;
              }
            `}</style>

            <Layout style={{ minHeight: '100vh' }}>
                <Layout>
                    <Layout.Header style={{
                        background: '#fff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        padding: '0 24px',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        height: '80px',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: 'auto',
                        }}>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#000',
                                marginRight: '48px'
                            }}>
                                打卡小工具
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Menu
                                theme="light"
                                mode="horizontal"
                                defaultSelectedKeys={['1']}
                                items={menuItems}
                                onClick={({ key }) => setSelectedKey(key)}
                                style={{
                                    borderBottom: 'none',
                                }}
                                selectedKeys={[selectedKey]}
                                onSelect={({ key }) => setSelectedKey(key)}
                                defaultActiveFirst={false}
                                itemIcon={({ icon, theme }) => (
                                    <span style={{ fontSize: theme === 'filled' ? '18px' : '16px' }}>
                                        {icon}
                                    </span>
                                )}
                                itemLabelAttrs={({ selected }) => ({
                                    style: {
                                        fontSize: selected ? '18px' : '16px',
                                        fontWeight: selected ? 'bold' : 'normal',
                                    },
                                })}
                            />
                        </div>
                        <div style={{
                            marginLeft: '24px',
                        }}>
                            <Dropdown overlay={<ProfileMenu onEdit={handleEditProfile} onLogout={handleLogout} />}
                                      trigger={['click']}>
                                <Space direction="horizontal">
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined style={{ color: '#fff' }} />}
                                        alt="Default User Avatar"
                                        style={{
                                            backgroundColor: '#000000',
                                            color: '#ffffff'
                                        }}
                                    />
                                </Space>
                            </Dropdown>
                        </div>
                    </Layout.Header>
                    <Content
                        style={{
                            margin: '24px 24px 0',
                            minHeight: 'calc(100vh - 100px)',
                        }}
                    >
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            {renderContent()}
                        </div>
                    </Content>
                    <CustomFooter/>
                </Layout>
            </Layout>
        </>
    );
};

export default Main;