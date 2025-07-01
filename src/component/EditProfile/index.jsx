import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Avatar,
    Upload,
    message,
    Card,
    Spin
} from 'antd';
import { UserOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import httpUtil from '../../util/HttpUtil';

const EditProfile = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [headImage, setHeadImage] = useState(null); // 存储图片对象

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
            }
        };

        const fetchAvatar = async () => {
            try {
                const response = await httpUtil.getRequest('/user/avatar');

                if (response.success && response.data?.base64) {
                    const { base64, mimeType } = response.data;
                    const imageUrl = `data:${mimeType};base64,${base64}`;
                    setAvatarUrl(imageUrl);
                } else {
                    setAvatarUrl(null);
                }
            } catch (error) {
                console.error('Failed to load avatar:', error);
                setAvatarUrl(null);
            }
        };

        // 并行加载用户信息和头像
        Promise.all([fetchUserInfo(), fetchAvatar()])
            .finally(() => {
                setLoading(false);
            });
    }, [form]);

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);

        if (headImage) {
            formData.append('headImage', headImage); // 添加头像文件
        }

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

    const beforeUpload = (file) => {
        const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isValidType) {
            message.error('只能上传 JPG/PNG 格式的图片!');
            return Upload.LIST_IGNORE;
        }
        const isValidSize = file.size / 1024 / 1024 < 5;
        if (!isValidSize) {
            message.error('图片大小不能超过 5MB!');
            return Upload.LIST_IGNORE;
        }
        setHeadImage(file);

        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl); // 立即更新头像显示
        return false;
    };

    useEffect(() => {
        return () => {
            if (avatarUrl && avatarUrl.startsWith('data:') === false) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, [avatarUrl]);

    if (loading) {
        return <Spin tip="加载中..." style={{ marginTop: 50 }} />;
    }

    return (
        <div style={{
            maxWidth: 600,
            margin: 'auto',
            padding: '24px',
            backgroundColor: '#f8f8f8',
            borderRadius: 8
        }}>
            <Button type="default" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                ← 返回
            </Button>

            <Card title="编辑个人资料" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="头像">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                size={80}
                                src={avatarUrl ? <img src={avatarUrl} alt="avatar" /> : null}
                                icon={<UserOutlined />}
                            />
                            <Upload
                                name="avatar"
                                listType="picture"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                style={{ marginLeft: 16 }}
                            >
                                <Button icon={<UploadOutlined />}>上传头像</Button>
                                {uploading && <LoadingOutlined />}
                            </Upload>
                        </div>
                    </Form.Item>

                    <Form.Item label="用户名" name="name" rules={[{ required: true }]}>
                        <Input placeholder="请输入用户名" />
                    </Form.Item>


                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[
                            { required: true },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                        ]}
                    >
                        <Input placeholder="请输入邮箱" disabled />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={uploading}>
                            保存修改
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditProfile;