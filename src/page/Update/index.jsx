import { Form, Input, Button, message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpUtil from '../../util/HttpUtil';

const Update = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const navigate = useNavigate();

    const backToLogin = () => {
        navigate("/login");
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
            message.info("验证码已发送到您的邮箱，请查收！");
        } else {
            message.error("获取验证码失败，请联系管理员");
        }
    };

    const requestUpdatePassword = async () => {
        if (!isValidEmail(email)) {
            message.error('请输入有效的邮箱地址');
            return;
        }

        const data = await httpUtil.getRequest("/user/updatePassword?" + "email=" + email + "&code=" + code + "&newPassword=" + password);
        if (data.success) {
            message.info("密码修改成功，请使用新密码登录");
            navigate('/login');
        } else {
            message.error(data.message || "密码修改失败，请重试");
        }
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            minHeight: '100vh',
            overflow: 'hidden',
        }}>
            {/* 左侧表单区域 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '30px',
                backgroundColor: '#f5f5f5', // 浅灰色背景
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: '#fff', // 白色表单卡片
                    padding: '30px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '20px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#333',
                    }}>
                        修改您的密码
                    </h2>
                    <p style={{
                        textAlign: 'center',
                        marginBottom: '30px',
                        color: '#666',
                    }}>
                        输入您注册时使用的邮箱地址
                    </p>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[
                                { required: true, message: '请输入您的邮箱!' },
                                { type: 'email', message: '请输入有效的邮箱地址!' }
                            ]}
                        >
                            <Input
                                placeholder="输入您的邮箱"
                                onChange={(e) => setEmail(e.target.value)}
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
                            label="验证码"
                            name="code"
                            rules={[{ required: true, message: '请输入验证码' }]}
                        >
                            <Input
                                placeholder="输入验证码"
                                onChange={(e) => setCode(e.target.value)}
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
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    type="primary"
                                    onClick={sendCode}
                                    style={{
                                        backgroundColor: '#000',
                                        borderColor: '#000',
                                        height: '40px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    获取验证码
                                </Button>
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="新密码"
                            name="newPassword"
                            rules={[{ required: true, message: '请输入新密码' }]}
                        >
                            <Input.Password
                                placeholder="输入新密码"
                                onChange={(e) => setPassword(e.target.value)}
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
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    type="primary"
                                    onClick={requestUpdatePassword}
                                    style={{
                                        backgroundColor: '#000',
                                        borderColor: '#000',
                                        width: '100%',
                                        height: '40px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    修改密码
                                </Button>
                                <Button
                                    type="link"
                                    onClick={backToLogin}
                                    style={{
                                        color: '#000',
                                        marginLeft: '10px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    返回登录
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            {/* 右侧图片区域 */}
            <div style={{
                background: 'url(/static/images/updateRight.jpg) no-repeat center center',
                backgroundSize: 'cover',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '30px',
                    right: '30px',
                    color: '#fff',
                }}>
                    <p style={{
                        fontSize: '16px',
                        lineHeight: '1.5',
                        marginBottom: '10px',
                    }}>
                        也许前方的道路并不平坦，但只要你愿意继续前行，终会在某一天，看见曾经的梦想，化作现实的模样。
                    </p>
                    <p style={{
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
            <span style={{
                marginRight: '5px',
            }}>
              <i className="fas fa-star"></i>
            </span>
                        踏路万里，终不负初心。
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Update;