import React, { useState } from 'react';
import { App as AntApp, Button, Form, Input } from 'antd';
import {
    LockOutlined,
    MailOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../../component/AuthShell';
import httpUtil from '../../util/HttpUtil';
import useCountdown from '../../util/useCountdown';

const Register = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [countdown, setCountdown] = useCountdown();
    const navigate = useNavigate();
    const { message } = AntApp.useApp();

    const sendCode = async () => {
        try {
            await form.validateFields(['email']);
        } catch (error) {
            return;
        }

        setSending(true);
        try {
            const email = form.getFieldValue('email');
            const data = await httpUtil.getRequest(`/user/code?email=${encodeURIComponent(email)}`);
            if (data.success) {
                message.success('验证码已发送，请查收邮箱');
                setCountdown(60);
            } else {
                message.warning(data.message || '验证码发送失败，请稍后再试');
            }
        } catch (error) {
            message.error('网络异常，请稍后再试');
        } finally {
            setSending(false);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('code', values.code);

        try {
            const data = await httpUtil.postRequest('/user/register', formData);
            if (data.success) {
                message.success('注册成功，请登录');
                navigate('/login');
            } else {
                message.error(data.message || '注册失败，请稍后再试');
            }
        } catch (error) {
            message.error('注册失败，请稍后再试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            image="/static/images/registerLogo.jpg"
            quote={
                <>
                    想要规律地被提醒？
                    <br />
                    从今天的第一条目标开始。
                </>
            }
            caption="START TODAY"
        >
            <h1 className="auth__title">创建账号</h1>
            <p className="auth__sub">注册后即可创建目标，开始每日打卡</p>

            <Form
                form={form}
                name="register"
                layout="vertical"
                size="large"
                requiredMark={false}
                onFinish={onFinish}
            >
                <Form.Item
                    name="name"
                    label="用户名"
                    rules={[
                        { required: true, message: '请输入用户名' },
                        { max: 30, message: '用户名最多 30 个字符' },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="你希望被怎么称呼"
                        maxLength={30}
                        autoComplete="nickname"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' },
                        { max: 30, message: '邮箱最多 30 个字符' },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="用于接收验证码"
                        maxLength={30}
                        autoComplete="email"
                    />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="邮箱验证码"
                    rules={[{ required: true, message: '请输入验证码' }]}
                >
                    <Input
                        prefix={<SafetyCertificateOutlined />}
                        placeholder="输入邮件中的验证码"
                        maxLength={30}
                        suffix={
                            <button
                                type="button"
                                className="code-btn"
                                onClick={sendCode}
                                disabled={sending || countdown > 0}
                            >
                                {countdown > 0
                                    ? `${countdown}s 后重发`
                                    : sending
                                    ? '发送中…'
                                    : '获取验证码'}
                            </button>
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        { required: true, message: '请输入密码' },
                        { min: 6, message: '密码长度至少为 6 位' },
                        { max: 30, message: '密码最多 30 个字符' },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="至少 6 位字符"
                        maxLength={30}
                        autoComplete="new-password"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="确认密码"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: '请再次输入密码' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="再次输入密码"
                        maxLength={30}
                        autoComplete="new-password"
                    />
                </Form.Item>

                <Button
                    className="auth__submit"
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                >
                    立即注册
                </Button>
            </Form>

            <p className="auth__foot">
                已有账号？
                <button
                    type="button"
                    className="auth-link auth-link--strong"
                    onClick={() => navigate('/login')}
                >
                    直接登录
                </button>
            </p>
        </AuthShell>
    );
};

export default Register;
