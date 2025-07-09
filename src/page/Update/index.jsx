import {Form, Input, Button, message} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import httpUtil from '../../util/HttpUtil';

const Update = () => {

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [code, setCode] = useState("")

    const navigate = useNavigate();

    const backToLogin = () => {
        navigate("/login")
    }

    const onFinish = (formData) => {
        console.log('Received values:', formData);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const updateEmailValue = (e) => {
        setEmail(e.target.value)
    }

    const updatePasswordValue = (e) => {
        setPassword(e.target.value)
    }

    const sendCode = async () => {
        if (!isValidEmail(email)) {
            message.error('请输入有效的邮箱地址');
            return;
        }

        const data = await httpUtil.getRequest("/user/code?email=" + email)
        if (data.success) {
            message.info("验证码已发送到您的邮箱，请查收！")
        } else {
            message.error("获取验证码失败，请联系管理员")
        }
    }

    const updateCodeValue = (e) => {
        setCode(e.target.value)
    }

    const requestUpdatePassword = async () => {
        if (!isValidEmail(email)) {
            message.error('请输入有效的邮箱地址');
            return;
        }

        const data = await httpUtil.getRequest("/user/updatePassword?" + "email=" + email + "&code=" + code + "&newPassword=" + password);
        if (data.success) {
            message.info("密码修改成功，请使用新密码登录")
            navigate('/login')
        } else {
            message.error(data.message || "密码修改失败，请重试")
        }
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Form
                name="basic"
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="邮箱"
                    name="email"
                    onChange={updateEmailValue}
                    rules={[{required: true, message: '请输入您的邮箱!'},
                        {type: 'email', message: '请输入有效的邮箱地址!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="验证码"
                    name="code"
                    onChange={updateCodeValue}
                    rules={[{required: true, message: '请输入验证码'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" onClick={sendCode}>
                            获取验证码
                        </Button>
                    </div>
                </Form.Item>

                <Form.Item
                    label="新密码"
                    name="newPassword"
                    onChange={updatePasswordValue}
                    rules={[{required: true, message: '请输入新密码'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" onClick={requestUpdatePassword}>
                            修改密码
                        </Button>
                        <Button type="primary" onClick={backToLogin}>
                            返回登录
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Update;