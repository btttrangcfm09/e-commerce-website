import { ProtectedRoute } from './protectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import Home from '@/pages/client/Home/Home';
import Login from '@/pages/client/Login';
import About from '@/pages/client/About';
import Contact from '@/pages/client/Contact';
import Shop from '@/pages/client/Shop';
import Cart from '@/pages/client/Cart';
import Checkout from '@/pages/client/Checkout';
import Account from '@/pages/client/Account';
import NotFound from '@/pages/client/NotFound';
import { Outlet } from 'react-router-dom';
import ProductDetail from '@/pages/client/Products';
import Register from '@/pages/client/Register';
import OrderDetail from '@/pages/client/Account/OrderDetail';

const clientRoutes = [
    {
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/about',
                element: <About />,
            },
            {
                path: '/contact',
                element: <Contact />,
            },
            {
                path: '/shop',
                element: <Shop />,
            },
            {
                path: '/products/:id',
                element: <ProductDetail />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                // element: <ProtectedRoute roles={['ADMIN', 'CUSTOMER']}/>,
                element: <ProtectedRoute roles={['ADMIN', 'CUSTOMER']}><Outlet/></ProtectedRoute>,
                children: [
                    {
                        path: '/cart',
                        element: <Cart />,
                    },
                    {
                        path: '/checkout',
                        element: <Checkout />,
                    },
                    {
                        path: '/account',
                        element: <Account />,
                    },
                    {
                        path: '/orders/:orderId',
                        element: <OrderDetail />,
                    },
                ],
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
];
export default clientRoutes;
