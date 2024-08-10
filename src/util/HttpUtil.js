import axios from 'axios';

const baseUrl = 'http://192.168.10.23:8080'; // 您的基础 URL

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        // 设置默认的请求头
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authorization')}`
    }
});

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

export default {
    getRequest,
    postRequest
}

