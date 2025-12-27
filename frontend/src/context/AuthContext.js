import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Tự động nạp user từ localStorage khi F5 trang
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const storedProfile = localStorage.getItem('profile');
        if (storedProfile) {
          setUser(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
        localStorage.removeItem('profile');
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  // 2. Hàm Login: Nhận thêm tham số 'isAdmin' để biết gọi API nào
  const login = async (username, password, isAdminLogin = false) => {
    try {
      let endpoint = '/client/signin'; // Mặc định là khách hàng
      
      // Nếu là đăng nhập Admin thì đổi đường dẫn
      if (isAdminLogin) {
        endpoint = '/admin/auth/login';
      }

      const res = await axiosInstance.post(endpoint, { username, password });
      console.log('AuthProvider: Login response:', res);
      if (res.status === 200) {
        // Backend Admin và Client có thể trả về cấu trúc hơi khác nhau
        // Nhưng thường đều trả về { profile, token } hoặc tương tự
        const { profile, token } = res.data;

        // Cập nhật State
        setUser(profile);

        // Lưu vào LocalStorage
        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem('auth', token); 

        return { success: true, role: profile.role };
      }

    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  // 3. Hàm Logout: Vẫn giữ logic thông minh check role
  const logout = async () => {
    try {
      if (user?.role === 'ADMIN') {
        await axiosInstance.post('/admin/auth/logout');
      } else {
        await axiosInstance.post('/client/logout'); // Dùng API logout của client
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Luôn xóa sạch data
      setUser(null);
      localStorage.removeItem('profile');
      localStorage.removeItem('auth');
      navigate('/'); 
    }
  };

  // 4. Hàm đăng nhập bằng Google
  const loginWithGoogle = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/client/auth/google`;
  };

  // 5. Xử lý callback từ Google (gọi sau khi redirect về)
  const handleGoogleCallback = (token, profile) => {
    try {
      // Lưu thông tin vào localStorage
      localStorage.setItem('auth', token);
      localStorage.setItem('profile', JSON.stringify(profile));
      
      // Cập nhật state
      setUser(profile);
      
      return { success: true };
    } catch (error) {
      console.error('Google callback handling error:', error);
      return { success: false, message: 'Failed to process Google login' };
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    handleGoogleCallback,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};