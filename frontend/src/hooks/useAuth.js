import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/api';

export const useProfilePopupLogic = () => {
    const navigate = useNavigate();
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const isAdmin = profile?.role === 'ADMIN';

    const handleNavigateToProfile = () => {
        navigate('/account');
    };

    const handleNavigateToOrders = () => {
        navigate('/orders');
    };

    const handleNavigateToAdmin = () => {
        navigate('/admin/dashboard');
    };

    const handleLogout = async () => {
        try {
            // Gọi API logout, nhưng không quan trọng có thành công hay không
            await axiosInstance.get('/client/signout').catch(() => {
                // Bỏ qua lỗi từ API, vẫn logout ở client
            });
        } catch (error) {
            // Bỏ qua lỗi
            console.log('Logout API call failed, proceeding with client logout');
        } finally {
            // Luôn luôn xóa dữ liệu local và chuyển trang
            localStorage.removeItem('auth');
            localStorage.removeItem('profile');
            navigate('/');
        }
    };

    return {
        handleNavigateToProfile,
        handleNavigateToOrders,
        handleNavigateToAdmin,
        handleLogout,
        isAdmin,
    };
};