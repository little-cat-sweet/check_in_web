import { Button, Form, Input, message} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpUtil from '../../util/HttpUtil';

const Register = () => {
    const [form] = Form.useForm();
    const [isMessageInitialized, setMessageInitialized] = useState(false);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        console.log("password", password);
        console.log("confirmPassword", confirmPassword);
    }, [password, confirmPassword]);

    const register = async () => {
        const nameValue = name;
        const emailValue = email;
        const passwordValue = password;
        const codeValue = code;

        if (confirmPassword !== passwordValue) {
            message.warning("密码不一致，请重新输入！");
            setPassword("");
            setConfirmPassword("");
            form.setFieldsValue({ password: "", confirmPassword: "" });
            return;
        }

        const formData = new FormData();
        formData.append('name', nameValue);
        formData.append('email', emailValue);
        formData.append('password', passwordValue);
        formData.append('code', codeValue);

        try {
            const data = await httpUtil.postRequest("/user/register", formData);

            if (data.success) {
                message.info("注册成功！");
                navigate("/login");
            } else {
                message.error(data.message);
            }
        } catch (error) {
            message.error("注册失败，请稍后再试。");
        }
    };

    if (!isMessageInitialized) {
        message.config({
            maxCount: 1,
        });
        setMessageInitialized(true);
    }

    const updateEmailValue = (e) => {
        setEmail(e.target.value);
    };

    const updateCode = (e) => {
        setCode(e.target.value);
    };

    const updateNameValue = (e) => {
        setName(e.target.value);
    };

    const updatePasswordValue = (e) => {
        setPassword(e.target.value);
    };

    const updateConfirmPasswordValue = (e) => {
        setConfirmPassword(e.target.value);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const sendCode = async () => {
        if (!isValidEmail(email)) {
            message.error('请输入有效的邮箱地址');
            return;
        }

        const data = await httpUtil.getRequest("/user/code?email=" + email);
        if (data.success) {
            message.info("验证码已发送至您的邮箱！");
        } else {
            message.info(data.message);
        }
    };

    const navigate = useNavigate();

    const backToLogin = () => {
        navigate("/login");
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            minHeight: '100vh',
            overflow: 'hidden',
        }}>
            <div style={{
                background: 'url(/static/images/registerLogo.jpg) no-repeat center center',
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '30px',
                color: 'white',
                position: 'relative',
                minHeight: '100vh',
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>打卡小工具</h1>
                </div>

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 30px' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '15px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>想要规律的被催促吗？</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.5', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}>
                        快来使用打卡小工具，轻松记录每日任务，培养良好习惯！
                    </p>
                </div>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Button type="text" icon={<i className="fab fa-weixin"></i>} style={{ color: 'white', fontSize: '24px' }} />
                        <Button type="text" icon={<i className="fab fa-weibo"></i>} style={{ color: 'white', fontSize: '24px' }} />
                        <Button type="text" icon={<i className="fab fa-qq"></i>} style={{ color: 'white', fontSize: '24px' }} />
                    </div>
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '30px 50px',
                minHeight: '100vh',
                overflowY: 'auto',
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: 'bold' }}>创建新账号</h2>
                        <p style={{ color: '#666' }}>
                            已有账号？<a href="#" onClick={backToLogin} style={{ color: '#1677ff' }}>立即登录</a>
                        </p>
                    </div>

                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        form={form}
                        layout="vertical"
                        style={{ flex: 1 }}
                    >
                        <Form.Item
                            label="用户名"
                            name="name"
                            rules={[{ required: true, message: '请输入用户名' }]}
                            onChange={updateNameValue}
                        >
                            <Input placeholder="请输入用户名" />
                        </Form.Item>

                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[
                                { required: true, message: '请输入邮箱地址' },
                                { type: 'email', message: '请输入有效的邮箱地址' }
                            ]}
                            onChange={updateEmailValue}
                        >
                            <Input placeholder="请输入邮箱地址" />
                        </Form.Item>

                        <Form.Item
                            label="验证码"
                            name="code"
                            rules={[
                                { required: true, message: '请输入验证码' },
                            ]}
                            onChange={updateCode}
                        >
                            <Input placeholder="请输入验证码" />
                        </Form.Item>

                        <Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button type="primary" onClick={sendCode} style={{ backgroundColor: '#1677ff', borderColor: '#1677ff' }}>
                                    获取验证码
                                </Button>
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[
                                { required: true, message: '请输入密码' },
                                { min: 6, message: '密码长度至少为6位' }
                            ]}
                            onChange={updatePasswordValue}
                        >
                            <Input.Password placeholder="请输入密码" />
                        </Form.Item>

                        <Form.Item
                            label="确认密码"
                            name="confirmPassword"
                            rules={[
                                { required: true, message: '请再次输入密码' },
                                { validator: (_, value) => {
                                        if (!value || value === password) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致'));
                                    }
                                }
                            ]}
                            onChange={updateConfirmPasswordValue}
                        >
                            <Input.Password placeholder="请再次输入密码" />
                        </Form.Item>

                        <Form.Item style={{ marginTop: 'auto' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={register}
                                style={{
                                    width: '100%',
                                    height: '40px',
                                    backgroundColor: '#1677ff',
                                    borderColor: '#1677ff',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                            >
                                立即注册
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;