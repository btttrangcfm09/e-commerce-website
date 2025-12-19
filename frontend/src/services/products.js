import axiosInstance from './api';

export const productsService = {
    getProducts: (params) => axiosInstance.get('/products', { params }),
    getProductDetails: (productId) => axiosInstance.get(`/products?id=${productId}`),
};