import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import FavoritesService from '@/services/favorites';
import FavoriteButton from '@/components/features/favorites/FavoriteButton';
import { useCartQuery } from '@/hooks/useCart';
import { API_URL } from '@/utils/constants';
import Banner from '@/components/common/Banner';

const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder.jpg';
  if (typeof imageUrl === 'string' && imageUrl.startsWith('/uploads')) {
    const backendUrl = API_URL || 'http://localhost:3000';
    return `${backendUrl}${imageUrl}`;
  }
  return imageUrl;
};

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartQuery();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const result = await FavoritesService.getFavorites({ limit: 100 });
      setFavorites(result.data || []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addItem({ productId, quantity: 1 });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const handleRemoveFavorite = (isFavorite) => {
    if (!isFavorite) {
      loadFavorites();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Banner />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Banner />
      
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-600 mt-2">
              {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">💝</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                No favorites yet
              </h2>
              <p className="text-gray-500 mb-6">
                Start adding products to your favorites to see them here!
              </p>
              <Link
                to="/shop"
                className="inline-block bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => {
                const imageUrl = normalizeImageUrl(
                  favorite.product_image_urls?.[0]
                );
                const productId = favorite.product_id;
                const price = parseFloat(favorite.product_price || 0);
                const inStock = favorite.product_stock > 0;

                return (
                  <div
                    key={favorite.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
                  >
                    <div className="relative">
                      <Link to={`/products/${productId}`}>
                        <img
                          src={imageUrl}
                          alt={favorite.product_name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                        />
                      </Link>
                      
                      <div className="absolute top-2 right-2">
                        <FavoriteButton
                          productId={productId}
                          size="md"
                          onToggle={handleRemoveFavorite}
                        />
                      </div>

                      {!inStock && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <Link
                        to={`/products/${productId}`}
                        className="block hover:text-rose-500 transition"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {favorite.product_name}
                        </h3>
                      </Link>

                      {favorite.category_name && (
                        <p className="text-sm text-gray-500 mb-2">
                          {favorite.category_name}
                        </p>
                      )}

                      <p className="text-xl font-bold text-rose-500 mb-3">
                        ${price.toFixed(2)}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(productId)}
                          disabled={!inStock}
                          className="flex-1 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <FaShoppingCart />
                          {inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
