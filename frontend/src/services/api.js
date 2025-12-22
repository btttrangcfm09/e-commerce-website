// api.js
import axios from 'axios';
import { API_URL } from '@/utils/constants';

const normalizeBaseUrl = (value) => {
    if (typeof value !== 'string') return '';
    return value.trim();
};

const axiosInstance = axios.create({
    baseURL: normalizeBaseUrl(API_URL) || 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Use request interceptor instead of response
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default axiosInstance;