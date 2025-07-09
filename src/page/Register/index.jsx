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


        console.log("ssss" + formData.toString())

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
        setCode(e.target.value)
    }

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

        const data = await httpUtil.getRequest("/user/code?email=" + email)
        if (data.success) {
            message.info("请查收您的邮箱！")
        } else {
            message.info(data.message)
        }
    }


    const navigate = useNavigate();

    const backToLogin = () => {
        navigate("/login");
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                form={form}
                layout="vertical"
                style={{ width: 400 }}
            >
                <Form.Item
                    label="姓名"
                    name="name"
                    rules={[{ required: true, message: '请输入姓名' }]}
                    onChange={updateNameValue}
                >
                    <Input />
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
                    <Input />
                </Form.Item>

                <Form.Item
                    label="验证码"
                    name="code"
                    rules={[
                        { required: true, message: '请输入验证码' },
                    ]}
                    onChange={updateCode}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" onClick={sendCode}>
                            获取验证码
                        </Button>
                    </div>
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                    onChange={updatePasswordValue}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="确认密码"
                    name="confirmPassword"
                    rules={[{ required: true, message: '请再次输入密码' }]}
                    onChange={updateConfirmPasswordValue}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button htmlType="button" onClick={backToLogin}>
                            返回登录
                        </Button>
                        <Button type="primary" htmlType="submit" onClick={register}>
                            注册
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register;