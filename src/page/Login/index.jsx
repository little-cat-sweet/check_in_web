import {Form, Input, Button} from 'antd';
import {message} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import httpUtil from '../../util/HttpUtil';

const Login = () => {

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
        message.error('表单验证失败');
    };

    const login = async () => {
        let data = null;
        try {
            data = await httpUtil.postRequest('/user/login?email=' + email + '&password=' + password, null);
            if (data.success === true) {
                localStorage.setItem("authorization", data.data)
                message.info("登录成功！")
                navigate('/main')
            } else {
                message.warning(data.message || "登录失败，请检查邮箱和密码")
                navigate('/login')
            }
        } catch (e) {
            message.error("网络错误，请联系管理员！")
        }
    }

    const handleUpdatePassword = () => {
        // 点击 "修改密码" 按钮时执行的函数，用于跳转到修改密码页面
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
                    label="邮箱"
                    name="email"
                    onChange={updateEmailValue}
                    rules={[{required: true, message: '请输入您的邮箱！'},
                        {type: 'email', message: '请输入有效的邮箱地址！'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    onChange={updatePasswordValue}
                    rules={[{required: true, message: '请输入您的密码！'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" htmlType="submit" onClick={login}>
                            登录
                        </Button>
                        <Button type="primary" onClick={goToRegister}>
                            注册
                        </Button>
                    </div>
                </Form.Item>

                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'left'}}>
                        <Button type="primary" onClick={handleUpdatePassword}>
                            修改密码
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;