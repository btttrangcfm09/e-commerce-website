import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import clientRoutes from './routes/clientRoutes';
import adminRoutes from './routes/adminRoutes';
import { CartProvider } from '@/components/features/cart/CartContext/CartContext';

const queryClient = new QueryClient();

function App() {
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
        <QueryClientProvider client={queryClient}>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        {renderRoutes(clientRoutes)}
                        {renderRoutes(adminRoutes)}
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </QueryClientProvider>
    );
}

export default App;
