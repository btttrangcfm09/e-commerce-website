import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import clientRoutes from './routes/clientRoutes';
import adminRoutes from './routes/adminRoutes';
import { CartProvider } from '@/components/features/cart/CartContext/CartContext';
import { Toaster } from '@/components/ui/sonner';
import AIChatButton from '@/components/features/ai-chat/AIChatButton';
import AIChatWindow from '@/components/features/ai-chat/AIChatWindow';
import { useState } from 'react';

const queryClient = new QueryClient();

function AppContent() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const location = useLocation();
    
    // Chỉ hiển thị AI Chat cho trang client (không phải admin)
    const isAdminPage = location.pathname.startsWith('/admin');

    const renderRoutes = (routes) => {
        return routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
                {route.children &&
                    route.children.map((childRoute) => (
                        <Route
                            key={childRoute.path || 'index'}
                            index={childRoute.index}
                            path={childRoute.path}
                            element={childRoute.element}
                        >
                            {childRoute.children && renderRoutes(childRoute.children)}
                        </Route>
                    ))}
            </Route>
        ));
    };

    return (
        <>
            <Routes>
                {renderRoutes(clientRoutes)}
                {renderRoutes(adminRoutes)}
            </Routes>
            <Toaster />
            
            {/* AI Shopping Assistant - Chỉ hiển thị cho trang customer */}
            {!isAdminPage && (
                <>
                    <AIChatButton 
                        onClick={() => setIsChatOpen(true)} 
                    />
                    <AIChatWindow 
                        isOpen={isChatOpen} 
                        onClose={() => setIsChatOpen(false)} 
                    />
                </>
            )}
        </>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <CartProvider>
                        <AppContent />
                    </CartProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
