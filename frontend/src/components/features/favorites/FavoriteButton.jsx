import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import FavoritesService from '@/services/favorites';

export default function FavoriteButton({ productId, size = 'md', showText = false, onToggle }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = !!localStorage.getItem('auth');

  useEffect(() => {
    if (isAuthenticated && productId) {
      checkFavoriteStatus();
    }
  }, [productId, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      const result = await FavoritesService.checkFavorite(productId);
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }

    setIsLoading(true);
    try {
      const result = await FavoritesService.toggleFavorite(productId);
      setIsFavorite(result.isFavorite);
      
      if (onToggle) {
        onToggle(result.isFavorite);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('Failed to update favorite');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'text-lg p-1',
    md: 'text-xl p-2',
    lg: 'text-2xl p-3',
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        rounded-full
        transition-all
        duration-200
        hover:bg-gray-100
        disabled:opacity-50
        disabled:cursor-not-allowed
        flex items-center gap-2
      `}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaRegHeart className="text-gray-600 hover:text-red-500" />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isFavorite ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </button>
  );
}
