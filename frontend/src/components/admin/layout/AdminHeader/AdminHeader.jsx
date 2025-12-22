import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, ShoppingCart, Users, Bell, User } from 'lucide-react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axiosInstance from '@/services/api';
import styles from './AdminHeader.module.css';

const searchItems = [
    { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { value: 'products', label: 'Products', icon: ShoppingCart, path: '/admin/products' },
    { value: 'orders', label: 'Orders', icon: Package, path: '/admin/orders' },
    { value: 'users', label: 'Users', icon: Users, path: '/admin/users' },
];

const AdminHeader = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [profile, setProfile] = React.useState(null);

    const handleCommandSelect = (path) => {
        setOpen(false);
        navigate(path);
    };

    React.useEffect(() => {
        const storedProfile = localStorage.getItem('profile');
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
        }
    }, []);

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/admin/auth/logout');
            localStorage.removeItem('profile');
            localStorage.removeItem('auth');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error.response?.data?.message || 'An error occurred');
        }
    };

    React.useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.searchContainer}>
                <Button
                    variant="outline"
                    className={cn(
                        'relative w-full justify-start text-sm text-muted-foreground',
                        'sm:pr-12 md:w-80 lg:w-96'
                    )}
                    onClick={() => setOpen(true)}
                >
                    <span className="hidden lg:inline-flex">Search admin pages...</span>
                    <span className="inline-flex lg:hidden">Search...</span>
                    <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>

                <CommandDialog open={open} onOpenChange={setOpen} className="rounded-lg border shadow-md">
                    <DialogTitle asChild className="px-3 py-3">
                        <VisuallyHidden>Search Admin Pages</VisuallyHidden>
                    </DialogTitle>
                    <CommandInput placeholder="Type a command or search..." className="border-none focus:ring-0"/>
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Pages">
                            {searchItems.map((item) => (
                                <CommandItem key={item.value} onSelect={() => handleCommandSelect(item.path)}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span>{item.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>

            <div className={styles.actions}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className={styles.actionButton}>
                            <Bell className="w-5 h-5" />
                            <span className={styles.notificationBadge}>3</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start">
                            <p className="font-medium">New User Registration</p>
                            <span className="text-sm text-muted-foreground">2 minutes ago</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start">
                            <p className="font-medium">New Order Received</p>
                            <span className="text-sm text-muted-foreground">1 hour ago</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start">
                            <p className="font-medium">Server Update Required</p>
                            <span className="text-sm text-muted-foreground">3 hours ago</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={styles.profile}>
                            <Avatar className="h-8 w-8">
                                {profile?.image && <AvatarImage src={profile.image} alt={profile.username} />}
                                <AvatarFallback>{getInitials(profile?.first_name, profile?.last_name)}</AvatarFallback>
                            </Avatar>
                            <span className={styles.profileName}>
                                {profile?.first_name} {profile?.last_name}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{profile?.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default AdminHeader;
