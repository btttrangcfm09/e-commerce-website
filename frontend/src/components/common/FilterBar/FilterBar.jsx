import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Slider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '@/services/api';

const FilterBar = ({ filters, onFilterChange, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data.categories);
        };
        fetchCategories();
    }, []);

    const getParentCategories = () => categories.filter((cat) => !cat.parent_category_id);
    const getChildCategories = (parentId) => categories.filter((cat) => cat.parent_category_id === parentId);

    const handlePriceChange = (_, newValue) => {
        onFilterChange({
            minPrice: newValue[0],
            maxPrice: newValue[1],
        });
    };

    const handleCategoryChange = (categoryId) => {
        onFilterChange({ categoryId: categoryId === filters.categoryId ? null : categoryId });
    };

    return (
        <div className="w-96 h-auto max-h-screen px-6 py-5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Filters</h2>
                <button onClick={onClose}>
                    <FaTimes className="text-gray-500" />
                </button>
            </div>

            {/* Categories */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className="text-lg font-semibold text-black">Categories</span>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="space-y-2">
                        {getParentCategories().map((parent) => (
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
                onClick={onClose}
                className="w-full bg-rose-500 text-white py-2 mt-4 rounded-lg hover:bg-rose-600 transition-colors"
            >
                Apply Filters
            </button>
        </div>
    );
};

export default FilterBar;
