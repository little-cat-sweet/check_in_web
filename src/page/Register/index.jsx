import {Button, Form, Input, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import httpUtil from '../../util/HttpUtil';

const Register = () => {

    const [form] = Form.useForm();


    const [isMessageInitialized, setMessageInitialized] = useState(false);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")

    useEffect(() => {
        console.log("password", password)
        console.log("confirmPassword", confirmPassword)
    }, [password, confirmPassword])

    const register = async () => {
        const nameValue = name;
        const emailValue = email;
        const passwordValue = password;
        if (confirmPassword !== passwordValue) {
            message.warning("password is not the same, pls take care of it !")
            setPassword("");
            setConfirmPassword("");
            form.setFieldsValue({password: "", confirmPassword: ""});
            console.log("password", password)
            console.log("confirmPassword", confirmPassword)
            return;
        }

        const requestParam = {
            name: nameValue,
            email: emailValue,
            password: passwordValue
        }

        const data = await httpUtil.postRequest("/user/register", requestParam);
        if (data.success) {
            message.info("register success !")
            navigate("/login")
        } else {
            message.error(data.message)
        }
    }

    if (!isMessageInitialized) {
        message.config({
            maxCount: 1,
        });
        setMessageInitialized(true);
    }

    const updateEmailValue = (e) => {
        console.log("value -> ", e.target.value)
        setEmail(e.target.value)
    }

    const updateNameValue = (e) => {
        setName(e.target.value)
    }
    const updatePasswordValue = (e) => {
        console.log("password -> ", e.target.value)
        setPassword(e.target.value)
    }


    const updateConfirmPasswordValue = (e) => {
        setConfirmPassword(e.target.value)
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

    const backToLogin = () => {
        navigate("/login")
    }


    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Form
                name="basic"
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                form={form}
            >

                <Form.Item
                    label="Name"
                    name="name"
                    onChange={updateNameValue}
                    rules={[{required: true, message: 'Please input your Name'}]}
                >
                    <Input/>
                </Form.Item>

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

                <Form.Item
                    label="ConfirmPassword"
                    name="confirmPassword"
                    onChange={updateConfirmPasswordValue}
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" htmlType="submit" onClick={backToLogin}>
                            Back to login
                        </Button>
                        <Button type="primary" onClick={register}>
                            Register
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register;