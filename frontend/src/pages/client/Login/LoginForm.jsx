import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [selectedRole, setSelectedRole] = useState('CUSTOMER');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Style cho Input: Nền xám nhạt, khi click vào thì viền đỏ
    const inputClass = "w-full px-4 py-3.5 rounded bg-[#F5F5F5] border-none text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#DB4444] outline-none transition-all placeholder-gray-400 text-sm font-medium";

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const isAdminLogin = selectedRole === 'ADMIN';
            const result = await login(formData.username, formData.password, isAdminLogin);

            if (selectedRole === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header: Đơn giản, chữ đen */}
            <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-black mb-2 tracking-wide">Log in to Exclusive</h2>
                <p className="text-gray-500 text-sm font-medium">Enter your details below</p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Role Switcher: Gọn gàng */}
                <div className="flex gap-4 mb-4">
                    <button
                        type="button"
                        onClick={() => setSelectedRole('CUSTOMER')}
                        className={`text-sm font-semibold transition-colors ${
                            selectedRole === 'CUSTOMER'
                                ? 'text-[#DB4444] border-b-2 border-[#DB4444]'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedRole('ADMIN')}
                        className={`text-sm font-semibold transition-colors ${
                            selectedRole === 'ADMIN'
                                ? 'text-[#DB4444] border-b-2 border-[#DB4444]'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Admin
                    </button>
                </div>

                <div className="space-y-4">
                    <input
                        name="username"
                        type="text"
                        className={inputClass}
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        className={inputClass}
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#DB4444] rounded focus:ring-[#DB4444] accent-[#DB4444]"
                        />
                        <span className="ml-2 text-sm text-gray-600 font-medium">Remember me</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded text-white font-bold text-sm uppercase tracking-wide transition-all duration-300
                        ${isLoading 
                            ? 'bg-red-300 cursor-not-allowed' 
                            : 'bg-[#DB4444] hover:bg-[#c93636] shadow-md hover:shadow-lg'
                        }`}
                >
                    {isLoading ? 'Logging In...' : 'Log In'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm font-medium">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-gray-800 font-bold hover:underline border-b border-gray-400 pb-0.5 ml-1"
                    >
                        Sign Up
                    </button>
                </p>
            </div>

            <div className="mt-6 pt-4 text-center">
                 <p className='text-xs text-gray-300 font-mono'>Admin: adminnghia / admin</p>
            </div>
        </div>
    );
}