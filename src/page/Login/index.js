import {Form, Input, Button} from 'antd';
import {message} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import httpUtil from '../../util/HttpUtil';

const Index = () => {

    const [isMessageInitialized, setMessageInitialized] = useState(false);
    const [email, updateEmail] = useState("")
    const [password, updatePassword] = useState("")

    if (!isMessageInitialized) {
        message.config({
            maxCount: 1,
        });
        setMessageInitialized(true);
    }

    const updateEmailValue = (e) => {
        console.log("value -> ", e.target.value)
        updateEmail(e.target.value)
    }
    const updatePasswordValue = (e) => {
        console.log("password -> ", e.target.value)
        updatePassword(e.target.value)
    }

    const navigate = useNavigate();
    const onFinish = (formData) => {
        console.log('Received values:', formData);
        // 在此处处理登录逻辑
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('This is a normal message');

    };

    const login = async () => {
        let data = null;
        try {
            data = await httpUtil.postRequest("/user/login?email=" + email + "&password=" + password, null);
            if (data.success === true) {
                localStorage.setItem("authorization", data.data)
                message.info("login success !")
                navigate('/main')
            } else {
                message.warning(data.message)
                navigate('/login')
            }
        } catch (e) {
            message.error("Pls find admin !")
        }
    }

    const handleUpdatePassword = () => {
        // 点击 "Update Password" 按钮时执行的函数，用于跳转到修改密码页面
        navigate('/update');
    };

    const goToRegister = () => {
        navigate('/register')
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
                    label="Email"
                    name="email"
                    onChange={updateEmailValue}
                    rules={[{required: true, message: 'Please input your email!'},
                        {type: 'email', message: 'Please enter a valid email address!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    onChange={updatePasswordValue}
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" htmlType="submit" onClick={login}>
                            Log in
                        </Button>
                        <Button type="primary" onClick={goToRegister}>
                            Register
                        </Button>
                    </div>
                </Form.Item>

                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" onClick={handleUpdatePassword}>
                            Update Password
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Index;