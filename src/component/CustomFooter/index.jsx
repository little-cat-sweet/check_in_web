import React from 'react';
import { Layout, Typography, Row, Col, Divider } from 'antd';

const { Footer } = Layout;
const { Title, Text } = Typography;

const CustomFooter = () => {
    return (
        <Footer
            style={{
                textAlign: 'center',
                background: '#000', // 黑色背景
                borderTop: '1px solid #444',
                padding: '32px 0',
                color: '#fff', // 白色文字
            }}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={4} style={{ margin: '0', color: '#fff' }}>
                        欢迎使用打卡小工具！
                    </Title>
                </Col>
                <Col span={24}>
                    <Text style={{ color: '#ccc' }}>
                        一个简单高效的小日常打卡应用。
                    </Text>
                </Col>
                <Col span={24}>
                    <Divider style={{ borderColor: '#444' }} />
                </Col>
                <Col span={24}>
                    <Text style={{ color: '#ccc' }}>
                        © 2025 打卡小工具@all rights
                    </Text>
                </Col>
            </Row>
        </Footer>
    );
};

export default CustomFooter;