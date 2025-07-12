import { Form, Input, Button} from 'antd';
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
            <div style={{ flex: 1, padding: '50px', backgroundColor: '#f9f9f9' }}>
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
                        <Input onChange={updateEmailValue} placeholder="邮箱" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入您的密码！' }]}
                    >
                        <Input.Password onChange={updatePasswordValue} placeholder="密码" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={login}>
                            登录
                        </Button>
                        <a
                            href="javascript:void(0);"
                            style={{ float: 'right' }}
                            onClick={() => navigate('/update')}
                        >
                            忘记密码?
                        </a>
                    </Form.Item>
                </Form>
                <p style={{ marginTop: '20px' }}>还没有账号? <a href="#" onClick={goToRegister}>立即注册</a></p>
            </div>
            <div style={{ flex: 1, background: 'url(/static/images/loginPageRight.jpg) no-repeat center center', backgroundSize: 'cover' }}></div>
        </div>
    );
};

export default Login;