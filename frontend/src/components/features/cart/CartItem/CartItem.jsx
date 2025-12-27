// src/components/features/cart/CartItem/CartItem.jsx
import React from 'react';
import { FaHeart, FaTimes, FaMinus, FaPlus } from 'react-icons/fa';
import FavoriteButton from '@/components/features/favorites/FavoriteButton';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const handleDecrease = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.quantity - 1);
        }
    };

    const handleIncrease = () => {
        onUpdateQuantity(item.quantity + 1);
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                <a href="#" className="w-20 shrink-0 md:order-1">
                    <img className="h-20 w-20" src={item.image} alt={item.name} />
                </a>

                <div className="flex items-center justify-between md:order-3 md:justify-end">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={handleDecrease}
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                        >
                            <FaMinus className="h-2.5 w-2.5 text-gray-900" />
                        </button>
                        <input
                            type="text"
                            readOnly
                            className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0"
                            value={item.quantity}
                        />
                        <button
                            type="button"
                            onClick={handleIncrease}
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                        >
                            <FaPlus className="h-2.5 w-2.5 text-gray-900" />
                        </button>
                    </div>
                    <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>

                <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                    <a href="#" className="text-base font-medium text-gray-900 hover:underline">
                        {item.name}
                    </a>

                    <div className="flex items-center gap-4">
                        <div className="inline-flex items-center text-sm font-medium text-gray-500">
                            <FavoriteButton productId={item.id} size="sm" showText={true} />
                        </div>
                        <button
                            type="button"
                            onClick={onRemove}
                            className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                        >
                            <FaTimes className="me-1.5 h-4 w-4" />
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
