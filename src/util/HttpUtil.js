import axios from 'axios';
import { message } from 'antd';
const baseUrl = process.env.REACT_APP_BASE_URL;

// 创建 axios 实例
const axiosInstance = axios.create({
    baseURL: baseUrl,
});

// 添加请求拦截器，确保每次请求都带上最新的 token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authorization');
        if (token) {
            config.headers['Authorization'] = `${token}`;
        }

        // 如果请求体是 FormData 类型，则不设置 Content-Type，让浏览器自动处理
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 1. 如果是 401 登录超时
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authorization');
            message.error('登录超时，请重新登录');

            // 2. 延迟跳转
            setTimeout(() => {
                window.location.href = '/login';
            }, 800);

            // 3. 返回一个 永远 pending 的 Promise，中断所有后续逻辑
            // 这样就不会进入业务代码的 catch！！！
            return new Promise(() => {});
        }

        // 其他错误正常抛出
        return Promise.reject(error);
    }
);

// POST 请求示例
export const postRequest = async (endpoint, data) => {
    try {
        const response = await axiosInstance.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('Error in POST request:', error);
        throw error;
    }
};

// GET 请求示例
export const getRequest = async (endpoint) => {
    try {
        const response = await axiosInstance.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error in GET request:', error);
        throw error;
    }
};

const httpUtil = {
    getRequest,
    postRequest
};

export default httpUtil;