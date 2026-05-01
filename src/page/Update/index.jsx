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
        // 在此处处理登录逻辑
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
            message.info("Please check your email !")
        } else {
            message.info("Find admin to have a help")
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
            message.info(data.message)
            navigate('/login')
        } else {
            message.error(data.message)
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
                    label="Email"
                    name="email"
                    onChange={updateEmailValue}
                    rules={[{required: true, message: 'Please input your email!'},
                        {type: 'email', message: 'Please enter a valid email address!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Code"
                    name="code"
                    onChange={updateCodeValue}
                    rules={[{required: true, message: 'Please input your code'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" onClick={sendCode}>
                            Request code
                        </Button>

                    </div>
                </Form.Item>
                <Form.Item
                    label="NewPassword"
                    name="newPassword"
                    onChange={updatePasswordValue}
                    rules={[{required: true, message: 'Please input your code'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" onClick={requestUpdatePassword}>
                            Update
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

export default Update;