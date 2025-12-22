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
    
    const [filters, setFilters] = useState({
        search: searchQuery,
        categoryId: null,
        minPrice: 0,
        maxPrice: 2000,
        page: 1,
        pageSize: 8,
        sortBy: 'id',
        sortOrder: 'asc',
    });
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [categories, setCategories] = useState([]);

    // Fetch categories for filtering
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data.categories);
        };
        fetchCategories();
    }, []);

    const { allProducts, isLoading } = useAllProducts();

    // Update filters when URL search params change
    useEffect(() => {
        if (searchQuery && searchQuery !== filters.search) {
            setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
        }
    }, [searchQuery]);

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
            <div className="bg-white shadow-sm py-4 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
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

                    <div className="text-gray-600">
                        Showing {(pagination.page - 1) * pagination.pageSize + 1}-
                        {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}{' '}
                        results
                    </div>

                    <div className="flex gap-4 items-center">
                        <select
                            value={filters.pageSize}
                            onChange={(e) => updateFilters({ pageSize: Number(e.target.value) })}
                            className="border px-3 py-1 rounded bg-white text-gray-700"
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
                            className="border px-3 py-1 rounded bg-white text-gray-700"
                        >
                            <option value="id-asc">Default</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-8">
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
