import React, { useEffect, useState } from 'react';
import { App as AntApp, Button, Form, Input, Skeleton } from 'antd';
import { ArrowLeftOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import httpUtil from '../../util/HttpUtil';

const EditProfile = () => {
    const navigate = useNavigate();
    const { message } = AntApp.useApp();
    const [form] = Form.useForm();
    const watchedName = Form.useWatch('name', form);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let active = true;
        const fetchUserInfo = async () => {
            try {
                const response = await httpUtil.getRequest('/user/userInfo');
                if (active && response.success) {
                    const { name, email } = response.data;
                    form.setFieldsValue({ name, email });
                }
            } catch (error) {
                if (active) {
                    message.error('加载用户信息失败');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchUserInfo();
        return () => {
            active = false;
        };
    }, [form, message]);

    const onFinish = async (values) => {
        setSaving(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);

        try {
            const response = await httpUtil.postRequest('/user/update', formData);
            if (response.success) {
                message.success('资料已更新');
                navigate('/main');
            } else {
                message.error(response.message || '更新失败');
            }
        } catch (error) {
            message.error('网络异常，请稍后再试');
        } finally {
            setSaving(false);
        }
    };

    const initial = (watchedName || '').trim().slice(0, 1).toUpperCase();

    return (
        <div className="profile-page">
            <div className="profile-page__inner rise">
                <button
                    type="button"
                    className="link-btn profile-page__back"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeftOutlined /> 返回
                </button>

                <div className="card">
                    <div className="profile-card__head">
                        <span className="profile-card__avatar" aria-hidden="true">
                            {initial || <UserOutlined />}
                        </span>
                        <div>
                            <h1 className="profile-card__title">编辑个人资料</h1>
                            <p className="card__sub">昵称会显示在主页右上角的账户菜单中</p>
                        </div>
                    </div>

                    <div className="profile-card__body">
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : (
                            <Form
                                form={form}
                                layout="vertical"
                                size="large"
                                requiredMark={false}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    label="用户名"
                                    name="name"
                                    rules={[
                                        { required: true, message: '请输入用户名' },
                                        { max: 30, message: '用户名最多 30 个字符' },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="请输入用户名"
                                        maxLength={30}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="邮箱"
                                    name="email"
                                    extra="邮箱作为登录账号，暂不支持修改"
                                    rules={[
                                        { required: true, message: '请输入邮箱' },
                                        { type: 'email', message: '请输入有效的邮箱地址' },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} disabled />
                                </Form.Item>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    loading={saving}
                                >
                                    保存修改
                                </Button>
                            </Form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
