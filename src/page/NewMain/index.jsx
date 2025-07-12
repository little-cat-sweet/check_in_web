import React from 'react';
import { Row, Col } from 'antd';
import './index.css';

const NewMain = () => {
    // 根据屏幕尺寸动态计算高度
    const getHeight = (baseHeight, screenHeight) => {
        if (window.innerWidth < 576) { // 移动端
            return baseHeight * 0.8; // 缩小高度比例
        }
        return (screenHeight / 100) * baseHeight; // 按比例分配高度
    };

    // 获取屏幕高度
    const screenHeight = window.innerHeight;

    return (
        <Row style={{ height: '100vh' }}>
            <Col span={24}>
                <div
                    className="header-style"
                    style={{
                        height: getHeight(15, screenHeight) + 'px',
                        lineHeight: getHeight(15, screenHeight) + 'px'
                    }}
                >
                    Header
                </div>
            </Col>
            <Col span={24}>
                <div
                    className="content-style"
                    style={{
                        minHeight: getHeight(70, screenHeight) + 'px',
                        lineHeight: getHeight(70, screenHeight) + 'px'
                    }}
                >
                    Content
                </div>
            </Col>
            <Col span={24}>
                <div
                    className="footer-style"
                    style={{
                        height: getHeight(15, screenHeight) + 'px',
                        lineHeight: getHeight(15, screenHeight) + 'px'
                    }}
                >
                    Footer
                </div>
            </Col>
        </Row>
    );
};

export default NewMain;