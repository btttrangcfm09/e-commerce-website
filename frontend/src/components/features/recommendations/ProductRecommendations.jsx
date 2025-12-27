import React from 'react';
import { useRecommendations } from '@/hooks/useRecommendations';
import RecommendationCard from './RecommendationCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

/**
 * Product Recommendations Component
 * Purpose: Display a grid of recommended products
 * 
 * Props:
 * - type: 'similar' | 'bought-together' | 'personalized' | 'purchase-based' | 'trending' | 'recently-viewed' | 'product-page' | 'homepage'
 * - title: Custom title (optional)
 * - description: Custom description (optional)
 * - params: Parameters for the recommendation type (productId, categoryId, etc.)
 * - limit: Number of recommendations to show (default: 8)
 * - columns: Number of columns in grid (default: 4)
 */
const ProductRecommendations = ({
    type,
    title = null,
    description = null,
    params = {},
    limit = 8,
    columns = 4,
    showTitle = true,
    showDescription = true,
    className = ''
}) => {
    const { recommendations, loading, error, metadata } = useRecommendations(type, {
        ...params,
        limit
    });

    // Don't render if no recommendations and not loading
    if (!loading && recommendations.length === 0) {
        return null;
    }

    // Use custom title/description or fallback to API metadata
    const displayTitle = title || metadata.title || 'Sản phẩm gợi ý';
    const displayDescription = description || metadata.description || '';

    // Grid column classes
    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
        6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    };

    return (
        <section className={`py-8 ${className}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                {(showTitle || showDescription) && (
                    <div className="mb-6">
                        {showTitle && (
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {displayTitle}
                            </h2>
                        )}
                        {showDescription && displayDescription && (
                            <p className="text-gray-600 text-sm">
                                {displayDescription}
                            </p>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner />
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">{error}</p>
                    </div>
                )}

                {/* Recommendations Grid */}
                {!loading && !error && recommendations.length > 0 && (
                    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-4`}>
                        {recommendations.map((product) => (
                            <RecommendationCard 
                                key={product.product_id} 
                                product={product} 
                            />
                        ))}
                    </div>
                )}

                {/* Message (e.g., "No personalized recommendations yet") */}
                {!loading && !error && recommendations.length === 0 && metadata.message && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">{metadata.message}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductRecommendations;
