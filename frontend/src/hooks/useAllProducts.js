import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { productsService } from '@/services/products';

export const useAllProducts = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['products', 'all'],
        queryFn: async () => {
            const response = await productsService.getProducts({ 
                pageSize: 10000,
                page: 1 
            });
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const allProducts = useMemo(() => {
        const products = data?.products || [];
        return products.map(p => ({
            ...p,
            id: p.product_id,
            name: p.product_name,
            description: p.product_description,
            price: p.product_price,
            stock: p.product_stock,
            image_urls: p.product_image_urls,
            category_id: p.category_id || null,
            category_name: p.category_name,
            category_path: p.category_path,
            is_active: p.is_active
        }));
    }, [data]);

    return {
        allProducts,
        isLoading,
        error
    };
};

export const filterProducts = (products, filters, categories = []) => {
    const {
        search = '',
        categoryId = null,
        minPrice = 0,
        maxPrice = 2000,
    } = filters;

    let filtered = [...products];
    if (search && search.trim()) {
        const searchLower = search.toLowerCase().trim();
        filtered = filtered.filter(product => 
            product.name?.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower)
        );
    }

    if (categoryId && categories.length > 0) {
        const getChildIds = (parentId) => {
            const children = categories.filter(cat => cat.parent_category_id === parentId);
            let allIds = children.map(c => c.id);
            children.forEach(child => {
                allIds = [...allIds, ...getChildIds(child.id)];
            });
            return allIds;
        };
        
        const validCategoryIds = [categoryId, ...getChildIds(categoryId)];
        
        filtered = filtered.filter(product => {
            return validCategoryIds.includes(product.category_id);
        });
    }
    filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return price >= minPrice && price <= maxPrice;
    });

    return filtered;
};

export const sortProducts = (products, sortBy = 'id', sortOrder = 'asc') => {
    const sorted = [...products];
    
    sorted.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case 'price':
                aValue = parseFloat(a.price);
                bValue = parseFloat(b.price);
                break;
            case 'name':
                aValue = a.name?.toLowerCase() || '';
                bValue = b.name?.toLowerCase() || '';
                break;
            case 'id':
            default:
                aValue = a.id;
                bValue = b.id;
                break;
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return sorted;
};

export const paginateProducts = (products, page = 1, pageSize = 8) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
        products: products.slice(startIndex, endIndex),
        pagination: {
            page,
            pageSize,
            total: products.length,
            totalPages: Math.ceil(products.length / pageSize)
        }
    };
};
