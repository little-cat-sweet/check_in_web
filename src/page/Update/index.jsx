import React, { useState } from 'react';
import { App as AntApp, Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../../component/AuthShell';
import httpUtil from '../../util/HttpUtil';
import useCountdown from '../../util/useCountdown';

const Update = () => {
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
        try {
            const url = `/user/updatePassword?email=${encodeURIComponent(values.email)}&code=${encodeURIComponent(values.code)}&newPassword=${encodeURIComponent(values.newPassword)}`;
            const data = await httpUtil.getRequest(url);

            if (data.success) {
                message.success('密码已更新，请使用新密码登录');
                navigate('/login');
            } else {
                message.error(data.message || '密码修改失败，请重试');
            }
        } catch (error) {
            message.error('网络异常，请稍后再试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            image="/static/images/updateRight.jpg"
            quote={
                <>
                    轻装前行，
                    <br />
                    从找回你的账号开始。
                </>
            }
            caption="ACCOUNT RECOVERY"
        >
            <h1 className="auth__title">重设密码</h1>
            <p className="auth__sub">通过注册邮箱验证身份后即可设置新密码</p>

            <Form
                form={form}
                name="reset"
                layout="vertical"
                size="large"
                requiredMark={false}
                onFinish={onFinish}
            >
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
                        placeholder="注册时使用的邮箱"
                        autoComplete="email"
                    />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="验证码"
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
                    name="newPassword"
                    label="新密码"
                    rules={[
                        { required: true, message: '请输入新密码' },
                        { min: 6, message: '密码长度至少为 6 位' },
                        { max: 30, message: '密码最多 30 个字符' },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="至少 6 位字符"
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
                    修改密码
                </Button>
            </Form>

            <p className="auth__foot">
                想起来了？
                <button
                    type="button"
                    className="auth-link auth-link--strong"
                    onClick={() => navigate('/login')}
                >
                    返回登录
                </button>
            </p>
        </AuthShell>
    );
};

export default Update;
