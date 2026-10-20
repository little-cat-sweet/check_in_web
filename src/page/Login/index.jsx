import React, { useState } from 'react';
import { App as AntApp, Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../../component/AuthShell';
import httpUtil from '../../util/HttpUtil';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { message } = AntApp.useApp();

    const onFinish = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await httpUtil.postRequest(
                `/user/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
                null
            );

            if (data.success === true) {
                localStorage.setItem('authorization', data.data);
                message.success('登录成功，欢迎回来');
                navigate('/main');
            } else {
                message.warning(data.message || '登录失败，请检查邮箱和密码');
            }
        } catch (error) {
            message.error('网络异常，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            image="/static/images/loginPageRight.jpg"
            quote={
                <>
                    把每一天的小事做好，
                    <br />
                    就是了不起的坚持。
                </>
            }
            caption="DAILY CHECK-IN"
        >
            <h1 className="auth__title">欢迎回来</h1>
            <p className="auth__sub">登录后继续你的每日打卡</p>

            <Form
                name="login"
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
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        { required: true, message: '请输入密码' },
                        { max: 30, message: '密码最多 30 个字符' },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="输入登录密码"
                        autoComplete="current-password"
                    />
                </Form.Item>

                <div className="auth__row">
                    <button
                        type="button"
                        className="auth-link"
                        onClick={() => navigate('/update')}
                    >
                        忘记密码？
                    </button>
                </div>

                <Button
                    className="auth__submit"
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                >
                    登录
                </Button>
            </Form>

            <p className="auth__foot">
                还没有账号？
                <button
                    type="button"
                    className="auth-link auth-link--strong"
                    onClick={() => navigate('/register')}
                >
                    立即注册
                </button>
            </p>
        </AuthShell>
    );
};

export default Login;
