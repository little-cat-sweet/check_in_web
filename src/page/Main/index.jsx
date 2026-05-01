import React, {useState, useEffect} from 'react';
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
    Spin,
    message
} from 'antd';

import Target from "../../component/Target";
import Conclusion from "../../component/Conclusion";
import TargetItemContainer from "../../component/TargetItemContainer";
import httpUtil from "../../util/HttpUtil";

const {Content, Footer, Sider} = Layout;

const items = [
    {
        key: '1',
        icon: <UserOutlined/>,
        label: 'Targets',
    },
    {
        key: '2',
        icon: <UploadOutlined/>,
        label: 'Target Config',
    },
    {
        key: '3',
        icon: <UploadOutlined/>,
        label: 'Conclusion',
    }
];

const Main = () => {
    const [selectedKey, setSelectedKey] = useState('1');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [loading, setLoading] = useState(true); // 加载状态

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

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await httpUtil.getRequest("/user/avatar");

                if (response.success && response.data?.base64) {
                    const {base64, mimeType} = response.data;
                    const imageUrl = `data:${mimeType};base64,${base64}`;
                    setAvatarUrl(imageUrl);
                } else {
                    setAvatarUrl(null);
                }
            } catch (error) {
                console.error('Failed to load avatar:', error);
                setAvatarUrl(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAvatar();
    }, []);

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
                            {loading ? (
                                <Spin size="small"/>
                            ) : (
                                <Avatar
                                    size="large"
                                    src={avatarUrl}
                                    icon={<UserOutlined/>}
                                    alt="User Avatar"
                                />
                            )}
                        </Space>
                    </Dropdown>
                </div>
            </Layout>
        </Layout>
    );
};

export default Main;