import {UploadOutlined, UserOutlined, VideoCameraOutlined} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import React, {useState, useEffect} from 'react';
import styles from "./index.css";

const {Content, Footer, Sider} = Layout;

const Index = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                <div style={styles.logo}/>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['4']}
                    items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
                        (icon, index) => ({
                            key: String(index + 1),
                            icon: React.createElement(icon),
                            label: `nav ${index + 1}`,
                        }),
                    )}
                />
            </Sider>
            <Layout>
                <Content
                    style={{
                        margin: '24px 16px 0',
                    }}
                >
                    <div
                        className={styles.siteLayoutBackground}
                        style={{
                            padding: 24,
                            minHeight: windowHeight,
                        }}
                    >
                        content
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Welcome use check in app !
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Index;