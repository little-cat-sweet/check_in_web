import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

const Detail = ({ data }) => {
    return (
        <Card title="数据详情" style={{ width: 300 }}>
            <Title level={5}>名称</Title>
            <Text>{data.name}</Text>
            <Title level={5} style={{ marginTop: 16 }}>描述</Title>
            <Text>{data.description}</Text>
            <Title level={5} style={{ marginTop: 16 }}>创建时间</Title>
            <Text>{data.createTime}</Text>
            <Title level={5} style={{ marginTop: 16 }}>状态</Title>
            <Text>{data.status === 1 ? '有效' : '无效'}</Text>
        </Card>
    );
};

export default Detail;    