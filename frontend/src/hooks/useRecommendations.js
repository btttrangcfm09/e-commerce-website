import { useState, useEffect } from 'react';
import recommendationService from '@/services/recommendations';

/**
 * Custom hook for product recommendations
 * Handles loading state and error handling
 */
export const useRecommendations = (type, params = {}) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metadata, setMetadata] = useState({});

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                setError(null);

                let response;

                switch (type) {
                    case 'similar':
                        response = await recommendationService.getSimilarProducts(
                            params.productId,
                            params.limit
                        );
                        break;

                    case 'bought-together':
                        response = await recommendationService.getFrequentlyBoughtTogether(
                            params.productId,
                            params.limit
                        );
                        break;

                    case 'personalized':
                        response = await recommendationService.getPersonalizedRecommendations(
                            params.limit,
                            params.excludeIds
                        );
                        break;

                    case 'purchase-based':
                        response = await recommendationService.getRecommendationsFromPurchaseHistory(
                            params.limit
                        );
                        break;

                    case 'trending':
                        response = await recommendationService.getTrendingInCategory(
                            params.categoryId,
                            params.excludeProductId,
                            params.limit
                        );
                        break;

                    case 'recently-viewed':
                        response = await recommendationService.getRecentlyViewed(
                            params.limit
                        );
                        break;

                    case 'product-page':
                        response = await recommendationService.getProductPageRecommendations(
                            params.productId,
                            params.limit
                        );
                        break;

                    case 'homepage':
                        response = await recommendationService.getHomepageRecommendations(
                            params.limit
                        );
                        break;

                    default:
                        throw new Error(`Unknown recommendation type: ${type}`);
                }

                if (response.data.success) {
                    setRecommendations(response.data.products || []);
                    setMetadata({
                        count: response.data.count,
                        recommendationType: response.data.recommendationType,
                        title: response.data.title,
                        description: response.data.description,
                        message: response.data.message
                    });
                } else {
                    setError('Failed to load recommendations');
                }

            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError(err.response?.data?.message || 'Failed to load recommendations');
                setRecommendations([]);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we have required params
        const hasRequiredParams = 
            (type === 'similar' || type === 'bought-together' || type === 'product-page') 
                ? params.productId 
                : type === 'trending' 
                    ? params.categoryId 
                    : true;

        if (hasRequiredParams) {
            fetchRecommendations();
        } else {
            setLoading(false);
        }

    }, [type, JSON.stringify(params)]);

    return { recommendations, loading, error, metadata };
};

/**
 * Hook for tracking product views
 */
export const useTrackProductView = () => {
    const trackView = async (productId, sessionId = null) => {
        try {
            await recommendationService.trackProductView(productId, sessionId);
        } catch (error) {
            console.error('Failed to track product view:', error);
            // Don't throw - tracking is not critical for UX
        }
    };

    return { trackView };
};

export default useRecommendations;
