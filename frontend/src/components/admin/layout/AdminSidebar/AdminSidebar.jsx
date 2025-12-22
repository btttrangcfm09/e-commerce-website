import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard, Users, ShoppingCart, ListOrdered,
    LogOut, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AdminSidebar.module.css';
import axiosInstance from '@/services/api';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: ListOrdered, label: 'Orders', path: '/admin/orders' },
    { icon: ShoppingCart, label: 'Products', path: '/admin/products' },
];

const AdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false); // State cho mobile
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileOpen(false); // Đóng menu sau khi chọn trên mobile
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.get('/admin/auth/logout').catch(() => {});
        } finally {
            localStorage.removeItem('auth');
            localStorage.removeItem('profile');
            navigate('/');
        }
    };

    return (
        <>
            {/* 1. Nút Hamburger chỉ hiện trên Mobile */}
            <div className="lg:hidden fixed top-4 left-4 z-[60]">
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
            </div>

            {/* 2. Lớp phủ (Overlay) khi mở menu trên Mobile */}
            {isMobileOpen && (
                <div 
                    className={styles.overlay} 
                    onClick={() => setIsMobileOpen(false)} 
                />
            )}

            {/* 3. Sidebar chính */}
            <div className={cn(
                styles.sidebar, 
                isCollapsed ? styles.collapsed : '',
                isMobileOpen ? styles.sidebarOpen : '' // Mở trên mobile
            )}>
                <div className={styles.header}>
                    <div 
                        className={cn(
                            styles.logo, 
                            'flex items-center space-x-2', 
                            isCollapsed && 'lg:justify-center'
                        )}
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        {(!isCollapsed || isMobileOpen) && (
                            <h1 className="text-xl font-bold truncate">Admin Panel</h1>
                        )}
                    </div>
                    {/* Nút thu gọn - chỉ hiện trên Desktop */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(styles.collapseBtn, "hidden lg:flex")}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </Button>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Button
                            key={item.path}
                            variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                            className={cn(
                                styles.navItem,
                                'w-full justify-start',
                                isCollapsed && 'lg:justify-center',
                                location.pathname === item.path && 'bg-secondary'
                            )}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <item.icon 
                                size={20} 
                                className={cn(
                                    'mr-2',
                                    isCollapsed && 'lg:mr-0',
                                    location.pathname === item.path && 'text-secondary-foreground'
                                )} 
                            />
                            {(!isCollapsed || isMobileOpen) && (
                                <span className="truncate">{item.label}</span>
                            )}
                        </Button>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <Button
                        variant="ghost"
                        className={cn(
                            styles.logoutBtn,
                            'w-full justify-start',
                            isCollapsed && 'lg:justify-center'
                        )}
                        onClick={handleLogout}
                    >
                        <LogOut size={20} className={cn('mr-2', isCollapsed && 'lg:mr-0')} />
                        {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
