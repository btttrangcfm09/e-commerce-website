/**
 * Product Suggestion Card Component
 * Purpose: Display product cards suggested by AI in chat
 * Shows product image, name, price, and action buttons
 */

import React from 'react';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductSuggestionCard = ({ product, onAddToCart, onTrackView }) => {
    const navigate = useNavigate();

    const handleViewProduct = () => {
        if (onTrackView) {
            onTrackView(product.id);
        }
        navigate(`/products/${product.id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    // Get first image or placeholder
    const imageUrl = product.imageUrls?.[0] || product.image_urls?.[0] || '/placeholder-product.png';

    return (
        <div
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={handleViewProduct}
        >
            {/* Product Image */}
            <div className="relative h-40 overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                    }}
                />

                {/* Stock badge */}
                {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        Chỉ còn {product.stock}
                    </div>
                )}

                {/* Out of stock badge */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Hết hàng</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3">
                {/* Product name */}
                <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2 min-h-[40px]">
                    {product.name}
                </h4>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-blue-600">
                        {product.formattedPrice || new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(product.price)}
                    </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleViewProduct}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                    >
                        <Eye className="w-4 h-4" />
                        Xem
                    </button>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductSuggestionCard;
