import axiosInstance from './api';

export const cartService = {
    getCart: () => axiosInstance.get('/client/cart/info'),
    addToCart: (productId, quantity) => axiosInstance.post('/client/cart/add', { productId, quantity }),
    updateCart: (productId, quantity) => axiosInstance.put('/client/cart/update', { productId, quantity }),
    removeFromCart: (productId) => axiosInstance.delete('/client/cart/remove', { data: { productId } }),
};
