import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/api';

export const useProfilePopupLogic = () => {
    const navigate = useNavigate();
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const isAdmin = profile?.role === 'ADMIN';

    const handleNavigateToProfile = () => {
        navigate('/account?section=public-profile');
    };

    const handleNavigateToOrders = () => {
        navigate('/account?section=my-orders');
    };

    const handleNavigateToAdmin = () => {
        navigate('/admin/dashboard');
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/client/logout');
            localStorage.removeItem('auth');
            localStorage.removeItem('profile');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
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