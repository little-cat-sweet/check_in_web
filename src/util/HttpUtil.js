import axios from 'axios';

const baseUrl = 'http://localhost:8080'; // 您的基础 URL

// 创建 axios 实例
const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 添加请求拦截器，确保每次请求都带上最新的 token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authorization');
        if (token) {
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// POST 请求示例
export const postRequest = async (endpoint, data) => {
    try {
        console.log("called -> " + endpoint);
        console.log("user token -> " + localStorage.getItem('authorization'));
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
        console.log("called -> " + endpoint);
        console.log("user token -> " + localStorage.getItem('authorization'));
        const response = await axiosInstance.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error in GET request:', error);
        throw error;
    }
};

export default {
    getRequest,
    postRequest
};
