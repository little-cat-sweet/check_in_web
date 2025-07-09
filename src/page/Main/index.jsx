import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ProfileMenu from '../../component/ProfileMenu';
import {
    UploadOutlined,
    UserOutlined,
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

const {Content, Footer, Sider} = Layout;

const items = [
    {
        key: '1',
        icon: <UserOutlined/>,
        label: '每日目标',
    },
    {
        key: '2',
        icon: <UploadOutlined/>,
        label:'目标',
    },
    {
        key: '3',
        icon: <UploadOutlined/>,
        label: '总结',
    }
];

const Main = () => {
    const [selectedKey, setSelectedKey] = useState('1');
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/editProfile');
    };

    const handleLogout = () => {
        message.info("logout")
        localStorage.removeItem("authorization");
        navigate('/login')
    };

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return <TargetItemContainer/>;
            case '2':
                return <Target/>;
            case '3':
                return <Conclusion/>;
            default:
                return null;
        }
    };

    return (
        <Layout style={{minHeight: '100vh'}}>
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
                <div className="demo-logo-vertical"/>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                    onClick={({key}) => setSelectedKey(key)}
                />
            </Sider>
            <Layout>
                <Content
                    style={{
                        margin: '24px 16px 0',
                        minHeight: 'calc(100vh - 100px)',
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


                <div style={{position: 'absolute', top: '24px', right: '24px'}}>
                    <Dropdown overlay={<ProfileMenu onEdit={handleEditProfile} onLogout={handleLogout}/>}
                              trigger={['click']}>
                        <Space direction="horizontal">
                            <Avatar
                                size="large"
                                icon={<UserOutlined/>}
                                alt="Default User Avatar"
                            />
                        </Space>
                    </Dropdown>
                </div>
            </Layout>
        </Layout>
    );
};

export default Main;