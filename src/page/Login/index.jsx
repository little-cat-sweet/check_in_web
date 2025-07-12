import { Form, Input, Button } from 'antd';
import { message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpUtil from '../../util/HttpUtil';

const Login = () => {
    const [isMessageInitialized, setMessageInitialized] = useState(false);
    const [email, updateEmail] = useState("");
    const [password, updatePassword] = useState("");

    if (!isMessageInitialized) {
        message.config({
            maxCount: 1,
        });
        setMessageInitialized(true);
    }

    const updateEmailValue = (e) => {
        console.log("value -> ", e.target.value);
        updateEmail(e.target.value);
    };

    const updatePasswordValue = (e) => {
        console.log("password -> ", e.target.value);
        updatePassword(e.target.value);
    };

    const navigate = useNavigate();

    const onFinish = (formData) => {
        console.log('Received values:', formData);
        // 在此处处理登录逻辑
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('表单验证失败');
    };

    const login = async () => {
        let data = null;
        try {
            data = await httpUtil.postRequest('/user/login?email=' + email + '&password=' + password, null);
            if (data.success === true) {
                localStorage.setItem("authorization", data.data);
                message.info("登录成功！");
                navigate('/main');
            } else {
                message.warning(data.message || "登录失败，请检查邮箱和密码");
                navigate('/login');
            }
        } catch (e) {
            message.error("网络错误，请联系管理员！");
        }
    };

    const handleUpdatePassword = () => {
        navigate('/update');
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{
                flex: 1,
                padding: '50px',
                backgroundColor: '#f5f5f5', // 浅灰色背景
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: '#fff',
                    padding: '30px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <img
                            src="/static/images/loginPageLogo.jpg"
                            alt="Logo"
                            style={{ width: '30px', marginRight: '10px' }}
                        />
                        <span>打卡小工具！</span>
                    </div>
                    <h1>嗨，欢迎回来</h1>
                    <p>欢迎回到您的专属空间</p>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: '请输入您的邮箱！' },
                                { type: 'email', message: '请输入有效的邮箱地址！' },
                            ]}
                        >
                            <Input
                                onChange={updateEmailValue}
                                placeholder="邮箱"
                                style={{
                                    width: '100%',
                                    height: '40px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '0 12px',
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入您的密码！' }]}
                        >
                            <Input.Password
                                onChange={updatePasswordValue}
                                placeholder="密码"
                                style={{
                                    width: '100%',
                                    height: '40px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '0 12px',
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={login}
                                style={{
                                    backgroundColor: '#1890ff',
                                    borderColor: '#1890ff',
                                    height: '40px',
                                    borderRadius: '4px',
                                    width: '100%',
                                }}
                            >
                                登录
                            </Button>
                            <a
                                href="javascript:void(0);"
                                style={{ float: 'right', marginTop: '10px', color: '#1890ff' }}
                                onClick={() => navigate('/update')}
                            >
                                忘记密码?
                            </a>
                        </Form.Item>
                    </Form>
                    <p style={{ marginTop: '20px' }}>
                        还没有账号? <a href="#" onClick={goToRegister} style={{ color: '#1890ff' }}>立即注册</a>
                    </p>
                </div>
            </div>
            <div style={{
                flex: 1,
                background: 'url(/static/images/loginPageRight.jpg) no-repeat center center',
                backgroundSize: 'cover'
            }}></div>
        </div>
    );
};

export default Login;