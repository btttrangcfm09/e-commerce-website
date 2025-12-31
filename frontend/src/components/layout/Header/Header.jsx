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
    
    // Lấy thông tin user từ localStorage (bao gồm avatar thực)
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const userAvatar = profile?.image || avatar;

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

    const UserActions = ({ layout = 'desktop' }) => {
        const isMobile = layout === 'mobile';

        return (
            <div className={isMobile ? 'flex flex-col gap-4 w-full' : 'flex items-center gap-6'}>
                <form
                    onSubmit={handleSearch}
                    className={
                        isMobile
                            ? 'flex items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow-md w-full'
                            : 'flex items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow-md'
                    }
                >
                    <button type="submit" className="focus:outline-none">
                        <FaSearch className="text-gray-500 mr-2 cursor-pointer hover:text-rose-500 transition" />
                    </button>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search products..."
                        defaultValue=""
                        className={
                            isMobile
                                ? 'bg-transparent focus:outline-none text-sm placeholder-gray-500 w-full'
                                : 'bg-transparent focus:outline-none text-sm placeholder-gray-500 w-32 sm:w-48'
                        }
                    />
                </form>

                <div className={isMobile ? 'flex items-center justify-between gap-6 w-full' : 'flex items-center gap-6'}>
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
                        className="relative w-10 h-10 rounded-full cursor-pointer border-2 border-white shrink-0"
                        onClick={() => setIsProfilePopupOpen(true)}
                    >
                        <img
                            src={userAvatar}
                            alt="User Avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                        <img
                            src={hatPng}
                            alt="Christmas Hat"
                            className="absolute -top-5 -left-4 w-10 h-auto pointer-events-none z-30"
                            style={{
                                transform: 'rotate(-15deg)',
                                filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

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

                <button
                    className="md:hidden text-2xl focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <nav
                    className={`${menuOpen ? 'flex' : 'hidden md:flex'} absolute md:relative top-16 md:top-0 left-0 md:left-auto w-full md:w-auto bg-black md:bg-transparent z-50 flex-col md:flex-row gap-4 md:gap-8 text-base font-medium items-stretch md:items-end p-4 md:p-0 max-h-[calc(100vh-4rem)] overflow-auto md:overflow-visible`}
                >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-end w-full md:w-auto">
                        <Link
                            to="/"
                            className="hover:text-rose-500 transition duration-200"
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/shop"
                            className="hover:text-rose-500 transition duration-200"
                            onClick={() => setMenuOpen(false)}
                        >
                            Shop
                        </Link>
                        <Link
                            to="/contact"
                            className="hover:text-rose-500 transition duration-200"
                            onClick={() => setMenuOpen(false)}
                        >
                            Contact
                        </Link>
                        <Link
                            to="/about"
                            className="hover:text-rose-500 transition duration-200"
                            onClick={() => setMenuOpen(false)}
                        >
                            About
                        </Link>
                    </div>

                    <div className="md:hidden pt-2 border-t border-white/10">
                        {isAuthenticated ? (
                            <UserActions layout="mobile" />
                        ) : (
                            <div className="flex justify-center">
                                <AuthButtons />
                            </div>
                        )}
                    </div>
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
