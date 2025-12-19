// src/utils/auth.js
import axiosInstance from '@/services/api';

export const checkAuth = async () => {
    try {
        const response = await axiosInstance.get(`/client/check`, { withCredentials: true });
        return response.data.user; // Token hợp lệ
    } catch (error) {
        return null; // Token không hợp lệ hoặc đã hết hạn
    }
};

export const logout = async () => {
    try {
        await axiosInstance.post(`/client/signout`, {}, { withCredentials: true });
    } catch (error) {
        console.error('Logout failed:', error);
    }
};
