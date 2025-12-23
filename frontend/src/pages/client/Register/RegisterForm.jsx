import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/api';

export default function RegisterForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputClass = "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#DB4444] focus:ring-1 focus:ring-[#DB4444] outline-none transition-all placeholder-gray-400 font-sans";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await axiosInstance.post('/client/signup', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-black mb-2 font-sans">Create Account</h2>
                <p className="text-gray-500 text-base">Enter your details below</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#DB4444] text-red-700 text-sm rounded-r">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <input
                        name="firstName"
                        type="text"
                        className={inputClass}
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="lastName"
                        type="text"
                        className={inputClass}
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

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
                    name="email"
                    type="email"
                    className={inputClass}
                    placeholder="Email"
                    value={formData.email}
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

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-lg text-white font-bold text-base transition-all duration-300
                            ${isLoading 
                                ? 'bg-red-300 cursor-not-allowed' 
                                : 'bg-[#DB4444] hover:bg-[#c93636] shadow-lg shadow-red-500/20 hover:translate-y-[-1px]'
                            }`}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-black font-bold hover:underline ml-1"
                    >
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
}