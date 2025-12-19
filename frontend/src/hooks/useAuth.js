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
            await axiosInstance.get('/client/signout');
            localStorage.removeItem('auth');
            localStorage.removeItem('profile');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
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