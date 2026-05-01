import { Button, Form, Input, message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpUtil from '../../util/HttpUtil';

const Register = () => {
    const [form] = Form.useForm();
    const [isMessageInitialized, setMessageInitialized] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [headImage, setHeadImage] = useState(null); // 存储图片对象

    useEffect(() => {
        console.log("password", password);
        console.log("confirmPassword", confirmPassword);
    }, [password, confirmPassword]);

    const beforeUpload = (file) => {
        const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isValidType) {
            message.error('只能上传 JPG/PNG 格式的图片!');
            return Upload.LIST_IGNORE;
        }
        const isValidSize = file.size / 1024 / 1024 < 5; // 限制为 5MB
        if (!isValidSize) {
            message.error('图片大小不能超过 5MB!');
            return Upload.LIST_IGNORE;
        }

        // 设置图片文件
        setHeadImage(file);
        return false; // 返回 false 阻止自动上传
    };

    const register = async () => {
        const nameValue = name;
        const emailValue = email;
        const passwordValue = password;

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

        if (headImage) {
            formData.append('headImage', headImage); // 添加头像文件
        }

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

    const updateNameValue = (e) => {
        setName(e.target.value);
    };

    const updatePasswordValue = (e) => {
        setPassword(e.target.value);
    };

    const updateConfirmPasswordValue = (e) => {
        setConfirmPassword(e.target.value);
    };

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
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: '请输入姓名' }]}
                    onChange={updateNameValue}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
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

                {/* 头像上传 */}
                <Form.Item label="头像" name="headImage">
                    <Upload
                        listType="picture-card"
                        showUploadList={true}
                        beforeUpload={beforeUpload}
                        multiple={false}
                    >
                        选择头像
                    </Upload>
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