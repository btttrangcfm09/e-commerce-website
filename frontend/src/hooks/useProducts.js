import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products';

const productKeys = {
    all: ['products'],
    list: (filters) => [...productKeys.all, 'list', filters],
};

export const useProducts = (options = {}) => {
    const {
        search,
        categoryId,
        minPrice,
        maxPrice,
        page = 1,
        pageSize = 10,
        sortBy = 'id',
        sortOrder = 'asc',
    } = options;

    const { data, isLoading, error } = useQuery({
        queryKey: productKeys.list({ search, categoryId, minPrice, maxPrice, page, pageSize, sortBy, sortOrder }),
        queryFn: () => productsService.getProducts({ 
            search, 
            categoryId, 
            minPrice, 
            maxPrice, 
            page, 
            pageSize, 
            sortBy, 
            sortOrder 
        }),
        select: (response) => ({
            products: response.data.products || [],
            pagination: {
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                total: response.data.pagination?.total || 0,
                totalPages: response.data.pagination?.totalPages || 1
            }
        })
    });

    return {
        products: data?.products || [],
        pagination: data?.pagination || {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 1
        },
        isLoading,
        error
    };
};