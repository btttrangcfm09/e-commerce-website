import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { Slider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '@/services/api';

const FilterBar = memo(({ filters, onFilterChange, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 2000]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data.categories);
        };
        fetchCategories();
    }, []);

    // Sync search input from props (only when externally changed)
    useEffect(() => {
        if (filters.search !== searchInput) {
            setSearchInput(filters.search || '');
        }
    }, [filters.search]);

    // Sync price range from props
    useEffect(() => {
        setPriceRange([filters.minPrice || 0, filters.maxPrice || 2000]);
    }, [filters.minPrice, filters.maxPrice]);

    const getParentCategories = useMemo(
        () => categories.filter((cat) => !cat.parent_category_id),
        [categories]
    );
    
    const getChildCategories = useCallback(
        (parentId) => categories.filter((cat) => cat.parent_category_id === parentId),
        [categories]
    );

    const handlePriceSliderChange = useCallback((_, newValue) => {
        setPriceRange(newValue);
        onFilterChange({
            minPrice: newValue[0],
            maxPrice: newValue[1],
        });
    }, [onFilterChange]);

    const handleCategoryChange = useCallback(
        (categoryId) => {
            onFilterChange({ categoryId: categoryId === filters.categoryId ? null : categoryId });
        },
        [onFilterChange, filters.categoryId]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== filters.search) {
                onFilterChange({ search: searchInput });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleSearchChange = useCallback((e) => {
        setSearchInput(e.target.value);
    }, []);

    const handleSearchSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (searchInput !== filters.search) {
                onFilterChange({ search: searchInput });
            }
        },
        [searchInput, filters.search, onFilterChange]
    );

    return (
        <div className="fixed lg:static inset-0 lg:inset-auto z-50 lg:z-0 lg:w-96 w-full h-screen lg:h-auto max-h-screen px-4 sm:px-6 py-5 bg-white lg:rounded-2xl shadow-2xl lg:shadow-lg border-0 lg:border border-gray-200 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Filters</h2>
                <button onClick={onClose}>
                    <FaTimes className="text-gray-500" />
                </button>
            </div>

            {/* Search */}
            <div className="mb-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                </form>
            </div>

            {/* Categories */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className="text-lg font-semibold text-black">Categories</span>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="space-y-2">
                        {getParentCategories.map((parent) => (
                            <div key={parent.id}>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`category-${parent.id}`}
                                        checked={filters.categoryId === parent.id}
                                        onChange={() => handleCategoryChange(parent.id)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`category-${parent.id}`} className="text-gray-700 cursor-pointer">
                                        {parent.name}
                                    </label>
                                    <button
                                        onClick={() =>
                                            setExpandedCategory(expandedCategory === parent.id ? null : parent.id)
                                        }
                                        className="ml-2 text-gray-500"
                                    >
                                        {expandedCategory === parent.id ? '−' : '+'}
                                    </button>
                                </div>

                                {expandedCategory === parent.id && (
                                    <div className="ml-6 mt-2 space-y-2">
                                        {getChildCategories(parent.id).map((child) => (
                                            <div key={child.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`category-${child.id}`}
                                                    checked={filters.categoryId === child.id}
                                                    onChange={() => handleCategoryChange(child.id)}
                                                    className="mr-2"
                                                />
                                                <label
                                                    htmlFor={`category-${child.id}`}
                                                    className="text-gray-600 cursor-pointer"
                                                >
                                                    {child.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </AccordionDetails>
            </Accordion>

            {/* Price Range */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className="text-lg font-semibold text-black">Price Range</span>
                </AccordionSummary>
                <AccordionDetails>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceSliderChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={2000}
                        step={10}
                        disableSwap
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-700">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </AccordionDetails>
            </Accordion>

            <button
                onClick={onClose}
                className="w-full bg-rose-500 text-white py-2 mt-4 rounded-lg hover:bg-rose-600 transition-colors"
            >
                Apply Filters
            </button>
        </div>
    );
});

FilterBar.displayName = 'FilterBar';

export default FilterBar;
