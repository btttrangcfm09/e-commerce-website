import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart } from 'react-icons/fa';
import { API_URL } from '@/utils/constants';

/**
 * Product Recommendation Card
 * Purpose: Display a single recommended product
 */
const RecommendationCard = ({ product }) => {
    // Normalize image URL
    const normalizeImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        if (typeof imageUrl === 'string' && imageUrl.startsWith('/uploads')) {
            const backendUrl = API_URL || 'http://localhost:3000';
            return `${backendUrl}${imageUrl}`;
        }
        return imageUrl;
    };

    const imageUrl = product.product_image_urls && product.product_image_urls.length > 0
        ? normalizeImageUrl(product.product_image_urls[0])
        : '/images/placeholder.png';

    const formatPrice = (price) => {
        // Format as USD (same as ProductCard)
        return `$${Number(price).toFixed(2)}`;
    };

    return (
        <Link 
            to={`/products/${product.product_id}`} 
            className="group block bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={product.product_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                />
                
                {/* Stock Badge */}
                {product.product_stock < 10 && product.product_stock > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        Chỉ còn {product.product_stock}
                    </div>
                )}
                
                {product.product_stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Hết hàng</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3">
                {/* Category */}
                {product.category_name && (
                    <div className="text-xs text-gray-500 mb-1">
                        {product.category_name}
                    </div>
                )}

                {/* Product Name */}
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.product_name}
                </h3>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                        {formatPrice(product.product_price)}
                    </span>
                </div>

                {/* Relevance Score (for debugging - remove in production) */}
                {product.relevance_score > 0 && process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-gray-400 mt-1">
                        Score: {product.relevance_score}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default RecommendationCard;
