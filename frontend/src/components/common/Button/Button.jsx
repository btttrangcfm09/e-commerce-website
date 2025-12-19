import { Link, useNavigate } from 'react-router-dom';

export const AuthButtons = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={() => navigate('/login')}
                className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition"
            >
                Login
            </button>
            <button
                onClick={() => navigate('/register')}
                className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition"
            >
                Register
            </button>
        </div>
    );
}