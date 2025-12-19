import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children, roles = [] }) => {
    const location = useLocation();
    const profile = JSON.parse(localStorage.getItem('profile'));
    const token = localStorage.getItem('auth');

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles.length && !roles.includes(profile?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;