import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useCartQuery } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

const CartPopup = ({ onClose }) => {
    const { cart, removeItem } = useCartQuery();
    const navigate = useNavigate();

    const handleViewCart = () => {
        navigate('/cart');
        if (onClose) onClose();
    };

    const total = cart?.cart_items?.reduce((sum, item) => sum + parseFloat(item.total_price), 0) || 0;

    return (
        <div className="absolute top-16 right-4 bg-gradient-to-b from-black from-10% via-zinc-700 to-neutral-700 text-white rounded-lg shadow-lg w-80 z-50 flex flex-col max-h-[600px]">
            <div className="p-4 flex-shrink-0">
                <h2 className="text-lg font-bold">Your Cart</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {cart?.cart_items?.length > 0 ? (
                    <ul className="flex flex-col gap-4">
                        {cart.cart_items.map((item) => (
                            <li key={item.product_id} className="flex items-center justify-between border-b pb-2">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-12 h-12 rounded object-cover"
                                    />
                                    <div>
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-sm">Qty: {item.quantity}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">${item.total_price}</p>
                                    <button
                                        onClick={() => removeItem(item.product_id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center">Your cart is empty.</p>
                )}

                {cart?.cart_items?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold">Total:</span>
                            <span className="text-xl font-bold text-rose-500">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                        <button
                            onClick={handleViewCart}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                            View Cart
                        </button>
                    </div>
                )}
            </div>

            {cart?.cart_items?.length > 0 && (
                <div className="p-4 border-t border-gray-600 flex-shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">Total:</span>
                        <span className="text-xl font-bold text-rose-500">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                    <button
                        onClick={handleViewCart}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        View Cart
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPopup;
