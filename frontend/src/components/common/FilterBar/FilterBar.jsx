import { useState, useEffect, memo } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Slider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FilterBar = ({ filters, categories = [], categoriesLoading = false, onFilterChange, onClose, isVisible = true }) => {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [accordionExpanded, setAccordionExpanded] = useState(true);
    const [priceAccordionExpanded, setPriceAccordionExpanded] = useState(true);

    // Auto-expand parent when a child category is selected
    useEffect(() => {
        if (filters.categoryId && !expandedCategory && categories.length > 0) {
            const selectedCategory = categories.find(cat => cat.id === filters.categoryId);
            if (selectedCategory && selectedCategory.parent_category_id) {
                setExpandedCategory(selectedCategory.parent_category_id);
            }
        }
    }, [filters.categoryId, categories, expandedCategory]);

    const getParentCategories = () => categories.filter((cat) => !cat.parent_category_id);
    const getChildCategories = (parentId) => categories.filter((cat) => cat.parent_category_id === parentId);

    const handlePriceChange = (_, newValue) => {
        onFilterChange({
            minPrice: newValue[0],
            maxPrice: newValue[1],
        });
    };

    const handleCategoryChange = (e, categoryId) => {
        e.preventDefault();
        e.stopPropagation();
        onFilterChange({ categoryId: categoryId === filters.categoryId ? null : categoryId });
    };

    return (
        <div 
            className="w-96 h-auto max-h-screen px-6 py-5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-y-auto transition-all duration-300"
            style={{ 
                display: isVisible ? 'block' : 'none'
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Filters</h2>
                <button onClick={onClose}>
                    <FaTimes className="text-gray-500" />
                </button>
            </div>

            {/* Categories */}
            <Accordion 
                expanded={accordionExpanded} 
                onChange={() => setAccordionExpanded(!accordionExpanded)}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className="text-lg font-semibold text-black">Categories</span>
                </AccordionSummary>
                <AccordionDetails>
                    {categoriesLoading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {getParentCategories().map((parent) => (
                            <div key={parent.id}>
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleCategoryChange(e, parent.id);
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.categoryId === parent.id}
                                            onChange={() => {}} 
                                            className="pointer-events-none"
                                            readOnly
                                        />
                                        <span className="text-gray-700 font-medium">
                                            {parent.name}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setExpandedCategory(expandedCategory === parent.id ? null : parent.id);
                                        }}
                                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors px-2 py-1 rounded"
                                    >
                                        {expandedCategory === parent.id ? '−' : '+'}
                                    </button>
                                </div>

                                {expandedCategory === parent.id && (
                                    <div className="ml-6 mt-2 space-y-1">
                                        {getChildCategories(parent.id).map((child) => (
                                            <div 
                                                key={child.id} 
                                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleCategoryChange(e, child.id);
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={filters.categoryId === child.id}
                                                    onChange={() => {}}
                                                    className="pointer-events-none"
                                                    readOnly
                                                />
                                                <span className="text-gray-600">
                                                    {child.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        </div>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* Price Range */}
            <Accordion 
                expanded={priceAccordionExpanded} 
                onChange={() => setPriceAccordionExpanded(!priceAccordionExpanded)}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className="text-lg font-semibold text-black">Price Range</span>
                </AccordionSummary>
                <AccordionDetails>
                    <Slider
                        value={[filters.minPrice, filters.maxPrice]}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={10000}
                        disableSwap
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-700">
                        <span>${filters.minPrice}</span>
                        <span>${filters.maxPrice}</span>
                    </div>
                </AccordionDetails>
            </Accordion>

            <button
                type="button"
                onClick={onClose}
                className="w-full bg-rose-500 text-white py-2 mt-4 rounded-lg hover:bg-rose-600 transition-colors"
            >
                Apply Filters
            </button>
        </div>
    );
};

export default memo(FilterBar);
