import React, { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaBars, FaTimes, FaHeart } from 'react-icons/fa';
import { ProfilePopup } from '@/components/common/ProfilePopup';
import CartPopup from '@/components/common/CartPopUp';
import { useCartQuery } from '@/hooks/useCart'; // Import useCartQuery
import avatar from '@/assets/images/HomePage/user.png';
import { AuthButtons } from '@/components/common/Button/Button';
import HeaderSnow from '@/components/effects/HeaderSnow';
import hatPng from '@/assets/images/hat.png';

const Header = () => {
    const navigate = useNavigate();
    const { cart } = useCartQuery();    
    const [menuOpen, setMenuOpen] = useState(false);
    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
    const [cartPopupOpen, setCartPopupOpen] = useState(false);
    const searchInputRef = useRef(null);
    const isAuthenticated = localStorage.getItem('auth');

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        const query = searchInputRef.current?.value?.trim();
        
        if (query) {
            navigate(`/shop?search=${encodeURIComponent(query)}`);
            if (searchInputRef.current) {
                searchInputRef.current.value = '';
            }
        }
    }, [navigate]);

    const UserActions = () => (
        <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="flex items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow-md">
                <button type="submit" className="focus:outline-none">
                    <FaSearch className="text-gray-500 mr-2 cursor-pointer hover:text-rose-500 transition" />
                </button>
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    defaultValue=""
                    className="bg-transparent focus:outline-none text-sm placeholder-gray-500 w-48"
                />
            </form>

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

            <Link to="/favorites" className="relative cursor-pointer group">
                <FaHeart className="text-2xl hover:text-rose-500 transition" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    My Favorites
                </span>
            </Link>

            <div 
                className="relative w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                onClick={() => setIsProfilePopupOpen(true)}
            >
                <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                />
                <img 
                    src={hatPng} 
                            alt="Christmas Hat"
                            // Chỉnh -top, -left để căn vị trí mũ cho chuẩn
                            className="absolute -top-5 -left-15 w-10 h-auto pointer-events-none z-30"
                            style={{ 
                                transform: 'rotate(-15deg)', // Xoay nghiêng chút cho đẹp
                                filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))' 
                            }} 
                />
            </div>
        </div>
    );

    return (
        <header className="bg-gradient-to-r from-black to-neutral-700 text-white shadow-lg sticky top-0 z-50 relative">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <HeaderSnow /> 
            </div>
            <div className="container mx-auto flex justify-between items-center p-4 relative z-10">
                <div className="flex items-center gap-8">
                    <h1 className="text-3xl font-extrabold tracking-wide">
                        <Link to="/" className="hover:opacity-90">
                            Exclusive
                        </Link>
                    </h1>
                </div>

                <button className="md:hidden text-2xl focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                    {isAuthenticated && (
                        <Link to="/favorites" className="hover:text-rose-500 transition duration-200 md:hidden">Favorites</Link>
                    )}
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
                    {/* <ProfilePopup/> */}
                    <ProfilePopup onClose={() => setIsProfilePopupOpen(false)} />
                </>
            )}


        </header>
    );
};

export default Header;
