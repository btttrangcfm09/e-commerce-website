import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { ProfilePopup } from '@/components/common/ProfilePopup';
import CartPopup from '@/components/common/CartPopUp';
import { useCartQuery } from '@/hooks/useCart'; // Import useCartQuery
import avatar from '@/assets/images/HomePage/user.png';
import { AuthButtons } from '@/components/common/Button/Button';

const Header = () => {
    const { cart } = useCartQuery();    
    const [menuOpen, setMenuOpen] = useState(false);
    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
    const [cartPopupOpen, setCartPopupOpen] = useState(false);
    const isAuthenticated = localStorage.getItem('auth');

    const UserActions = () => (
        <div className="flex items-center gap-6">
            <div className="flex items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow-md">
                <FaSearch className="text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search here..."
                    className="bg-transparent focus:outline-none text-sm placeholder-gray-500 w-48"
                />
            </div>

            <div 
                className="relative cursor-pointer" 
                onClick={() => setCartPopupOpen(!cartPopupOpen)}
            >
                <FaShoppingCart className="text-2xl hover:text-rose-500 transition" />
                {cart?.cart_items?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full px-2 py-0.5">
                        {cart.cart_items.length}
                    </span>
                )}
            </div>

            <div 
                className="relative w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-white"
                onClick={() => setIsProfilePopupOpen(true)}
            >
                <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );

    return (
        <header className="bg-gradient-to-r from-black to-neutral-700 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                <div className="flex items-center gap-8">
                    <h1 className="text-3xl font-extrabold tracking-wide">
                        <Link to="/" className="hover:opacity-90">
                            Exclusive
                        </Link>
                    </h1>
                </div>

                <button className="md:hidden text-2xl focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <nav className={`${menuOpen ? 'flex' : 'hidden md:flex'} absolute md:relative top-16 md:top-0 left-0 md:left-auto w-full md:w-auto bg-black md:bg-transparent z-50 flex-col md:flex-row gap-4 md:gap-8 text-base font-medium items-center md:items-end p-4 md:p-0`}>
                    <Link to="/" className="hover:text-rose-500 transition duration-200">Home</Link>
                    <Link to="/shop" className="hover:text-rose-500 transition duration-200">Shop</Link>
                    <Link to="/contact" className="hover:text-rose-500 transition duration-200">Contact</Link>
                    <Link to="/about" className="hover:text-rose-500 transition duration-200">About</Link>
                </nav>

                <div className="hidden md:flex">
                    {isAuthenticated ? <UserActions /> : <AuthButtons />}
                </div>
            </div>

            {cartPopupOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setCartPopupOpen(false)} />
                    <CartPopup onClose={() => setCartPopupOpen(false)} />
                </>
            )}

            {isProfilePopupOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsProfilePopupOpen(false)} />
                    <ProfilePopup/>
                </>
            )}
        </header>
    );
};

export default Header;
