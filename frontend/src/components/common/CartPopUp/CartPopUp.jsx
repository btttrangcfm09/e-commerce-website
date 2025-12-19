import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useCartQuery } from '@/hooks/useCart';

const CartPopup = () => {
    const { cart, removeItem } = useCartQuery();

    return (
        <div className="absolute top-16 right-4 bg-gradient-to-b from-black from-10% via-zinc-700 to-neutral-700 text-white rounded-lg shadow-lg w-80 p-4 z-50">
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold">Your Cart</h2>

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
                    <p className="text-gray-600 text-center">Your cart is empty.</p>
                )}
            </div>
        </div>
    );
};

export default CartPopup;
