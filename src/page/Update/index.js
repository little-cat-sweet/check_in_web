import {Form, Input, Button} from 'antd';
import React from 'react';
import {useNavigate} from 'react-router-dom';

const Index = () => {

    const navigate = useNavigate();

    const backToLogin = () => {
        navigate("/login")
    }
    const onFinish = (formData) => {
        console.log('Received values:', formData);
        // 在此处处理登录逻辑
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

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
                    rules={[{required: true, message: 'Please input your email!'},
                        {type: 'email', message: 'Please enter a valid email address!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Code"
                    name="code"
                    rules={[{required: true, message: 'Please input your code'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="NewPassword"
                    name="newPassword"
                    rules={[{required: true, message: 'Please input your code'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" htmlType="send code">
                            Log in
                        </Button>
                        <Button type="primary" onClick={backToLogin}>
                            back to login
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Index;