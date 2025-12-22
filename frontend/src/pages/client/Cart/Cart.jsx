// src/pages/client/Cart/Cart.jsx
import React from 'react';
import { CartItem } from '@/components/features/cart/CartItem';
import { OrderSummary } from '@/components/features/cart/OrderSummary';
import { useCartQuery } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, isLoading, updateItem, removeItem } = useCartQuery();

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    const total = cart?.cart_items.reduce((sum, item) => sum + parseFloat(item.total_price), 0) || 0;

    const summary = {
        total,
        originalPrice: total, // If no discount
        shippingCost: 0, // If free shipping
    };

    return (
        <section className="bg-white py-8 antialiased md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Shopping Cart</h2>

                <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                    <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                        <div className="space-y-6">
                            {cart?.cart_items.map((item) => (
                                <CartItem
                                    key={item.product_id}
                                    item={{
                                        id: item.product_id,
                                        name: item.product_name,
                                        price: item.unit_price,
                                        quantity: item.quantity,
                                        total: item.total_price,
                                        image: item.image_urls?.[0] || '/placeholder.jpg',
                                    }}
                                    onUpdateQuantity={(quantity) =>
                                        updateItem({
                                            productId: item.product_id,
                                            quantity,
                                        })
                                    }
                                    onRemove={() => removeItem(item.product_id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                        <OrderSummary summary={summary} onCheckout={() => navigate('/checkout')} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cart;
