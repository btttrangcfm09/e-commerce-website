import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductTable } from '@/components/admin/products/ProductTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import axiosInstance from '@/services/api';
import styles from './ProductList.module.css';

const ProductList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    
    // Form state
    const [searchForm, setSearchForm] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
        includeInactive: false
    });

    // API filters state
    const [filters, setFilters] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
        includeInactive: false,
        page: 1,
        pageSize: 10,
        sortBy: 'id',
        sortOrder: 'asc'
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/admin/products', { params: filters });
            setProducts(response.data.products);
            setPagination(response.data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(prev => ({
            ...prev,
            ...searchForm,
            page: 1
        }));
    };

    const updateFormField = (field, value) => {
        setSearchForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) return <div className={styles.loadingContainer}>Loading...</div>;
    if (error) return <div className={styles.errorContainer}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className="space-y-4 mb-6">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Button onClick={() => navigate('/admin/products/add')}>Add Product</Button>
                </div>
                
                <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
                    <div className="flex-1">
                        <Input
                            placeholder="Search products..."
                            value={searchForm.search}
                            onChange={(e) => updateFormField('search', e.target.value)}
                            className="max-w-xs"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min price"
                            value={searchForm.minPrice}
                            onChange={(e) => updateFormField('minPrice', e.target.value)}
                            className="w-24"
                        />
                        <span>-</span>
                        <Input
                            type="number"
                            placeholder="Max price"
                            value={searchForm.maxPrice}
                            onChange={(e) => updateFormField('maxPrice', e.target.value)}
                            className="w-24"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button type="submit">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>
                </form>
            </div>

            <ProductTable
                products={products}
                pagination={pagination}
                onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                onSort={(sortBy, sortOrder) => setFilters(prev => ({ ...prev, sortBy, sortOrder }))}
                currentSort={{
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder
                }}
                onProductDeleted={fetchProducts}
            />
        </div>
    );
};

export default ProductList;