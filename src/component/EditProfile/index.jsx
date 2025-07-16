import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    message,
    Card,
    Spin,
    Row,
    Col
} from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.css';
import httpUtil from '../../util/HttpUtil';

const EditProfile = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await httpUtil.getRequest('/user/userInfo');
                if (response.success) {
                    const { name, email } = response.data;
                    form.setFieldsValue({ name, email });
                }
            } catch (error) {
                message.error('加载用户信息失败');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [form]);

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);

        try {
            const response = await httpUtil.postRequest('/user/update', formData);
            if (response.success) {
                message.success('资料更新成功');
                navigate('/main')
            } else {
                message.error(response.message || '更新失败');
            }
        } catch (error) {
            message.error('网络错误，请稍后再试');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin tip="加载中..." size="large" />
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: 600,
            margin: 'auto',
            padding: '24px',
            backgroundColor: '#f8f8f8',
            borderRadius: 8,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginTop: '50px'
        }}>
            {/* 返回按钮居中 */}
            <Row justify="start" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Button type="default" onClick={() => navigate(-1)}>
                        ← 返回
                    </Button>
                </Col>
            </Row>

            <Card
                title="编辑个人资料"
                bordered={false}
                style={{ textAlign: 'center', padding: '24px', borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            >
                {/* 表单容器设置最大宽度并居中 */}
                <div style={{ maxWidth: 300, margin: '0 auto' }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        style={{ width: '100%' }}
                    >
                        <Form.Item
                            label="用户名"
                            name="name"
                            rules={[{ required: true }]}
                            labelCol={{ span: 24, style: { textAlign: 'left' } }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input placeholder="请输入用户名" style={{ borderRadius: 8 }} />
                        </Form.Item>

                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[
                                { required: true },
                                { type: 'email', message: '请输入有效的邮箱地址' }
                            ]}
                            labelCol={{ span: 24, style: { textAlign: 'left' } }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input placeholder="请输入邮箱" disabled style={{ borderRadius: 8 }} />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="black-button"
                                style={{ borderRadius: 8 }}
                            >
                                保存修改
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default EditProfile;