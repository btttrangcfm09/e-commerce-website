import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaBars, FaFilter, FaTh } from 'react-icons/fa';
import { useAllProducts, filterProducts, sortProducts, paginateProducts } from '@/hooks/useAllProducts';
import BannerImg from '@/assets/shoppage/banner.jpg';
import FilterBar from '@/components/common/FilterBar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Pagination } from '@/components/common/Pagination';
import { ProductCard } from '@/components/features/product/ProductCard';
import axiosInstance from '@/services/api';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryParam = searchParams.get('category');
    
    const [filters, setFilters] = useState({
        search: searchQuery,
        categoryId: categoryParam ? parseInt(categoryParam) : null,
        minPrice: 0,
        maxPrice: 2000,
        page: 1,
        pageSize: 8,
        sortBy: 'id',
        sortOrder: 'asc',
    });
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data.categories);
        };
        fetchCategories();
    }, []);

    const { allProducts, isLoading } = useAllProducts();

    useEffect(() => {
        const updates = {};
        if (searchQuery && searchQuery !== filters.search) {
            updates.search = searchQuery;
            updates.page = 1;
        }
        if (categoryParam && parseInt(categoryParam) !== filters.categoryId) {
            updates.categoryId = parseInt(categoryParam);
            updates.page = 1;
        }
        if (Object.keys(updates).length > 0) {
            setFilters((prev) => ({ ...prev, ...updates }));
        }
    }, [searchQuery, categoryParam]);

    const { products, pagination } = useMemo(() => {
        let filtered = filterProducts(allProducts, filters, categories);
        filtered = sortProducts(filtered, filters.sortBy, filters.sortOrder);
        return paginateProducts(filtered, filters.page, filters.pageSize);
    }, [allProducts, filters, categories]);

    const updateFilters = useCallback((newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    }, []);

    const handlePageChange = useCallback((newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    }, []);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Banner */}
            <div className="relative h-64 flex flex-col justify-center items-center">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BannerImg})` }} />
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-medium mb-2 text-gray-200">Shop</h1>
                    <nav className="text-xl font-light text-gray-200">
                        <Link to="/" className="hover:text-rose-500 font-medium">
                            Home
                        </Link>
                        <span className="mx-2 font-medium">&gt;</span>
                        <span>Shop</span>
                    </nav>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white shadow-sm py-4 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                            className="bg-rose-500 text-white py-2 px-4 rounded flex items-center"
                        >
                            <FaFilter className="mr-2" /> Filter
                        </button>
                        <FaTh className="cursor-pointer text-xl text-gray-600" />
                        <FaBars className="cursor-pointer text-xl text-gray-600" />
                    </div>

                    <div className="text-gray-600 text-sm sm:text-base order-3 sm:order-2">
                        Showing {(pagination.page - 1) * pagination.pageSize + 1}-
                        {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}{' '}
                        results
                    </div>

                    <div className="flex gap-2 sm:gap-4 items-center order-2 sm:order-3">
                        <select
                            value={filters.pageSize}
                            onChange={(e) => updateFilters({ pageSize: Number(e.target.value) })}
                            className="border px-2 sm:px-3 py-1 rounded bg-white text-gray-700 text-sm"
                        >
                            {[4, 8, 16].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>

                        <select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split('-');
                                updateFilters({ sortBy, sortOrder });
                            }}
                            className="border px-2 sm:px-3 py-1 rounded bg-white text-gray-700 text-sm"
                        >
                            <option value="id-asc">Default</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Filter Sidebar */}
                    {isFilterVisible && (
                        <FilterBar
                            filters={filters}
                            onFilterChange={updateFilters}
                            onClose={() => setIsFilterVisible(false)}
                        />
                    )}

                    {/* Product Grid */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.product_id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Shop;
