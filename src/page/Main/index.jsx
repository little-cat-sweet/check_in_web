import React, {useState} from 'react';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import Target from "../../component/Target";
import Conclusion from "../../component/Conclusion";
const {Content, Footer, Sider } = Layout;

const items = [
    {
        key: '1',
        icon: <UserOutlined />,
        label: 'Targets',
    },
    {
        key: '2',
        icon: <UploadOutlined />,
        label: 'Conclusion',
    },
];

const Main = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [selectedKey, setSelectedKey] = useState('1');
    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return <Target/>;
            case '2':
                return <Conclusion/>;
            default:
                return null;
        }
    };
    return (
        <Layout>
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
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} onClick={handleMenuClick} />
            </Sider>
            <Layout>
                <Content
                    style={{
                        margin: '24px 16px 0',
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
            </Layout>
        </Layout>
    );
};
export default Main;