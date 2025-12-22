import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);

    const refreshCartItems = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/client/cart/info');
            if (Array.isArray(response?.data?.cart_items)) {
                setCartItems(response.data.cart_items);
            } else {
                console.error('Unexpected response structure:', response?.data);
                setCartItems([]);
            }
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        }
    }, []);

    // Fetch cart items from API when the component mounts
    useEffect(() => {
        (async () => {
            try {
                await refreshCartItems();
            } finally {
                setLoading(false);
            }
        })();
    }, [refreshCartItems]);

    const addToCart = async (item) => {
        try {
            const productId = Number(item?.productId ?? item?.product_id ?? item?.id);
            const quantity = Number(item?.quantity ?? 1);

            if (!productId || productId <= 0) {
                throw new Error('Invalid productId');
            }
            if (!quantity || quantity <= 0) {
                throw new Error('Invalid quantity');
            }

            await axiosInstance.post(
                `/client/cart/add`,
                {
                    productId,
                    quantity,
                }
            );
    
            // Immediately update local cart state
            setCartItems((prev) => {
                const existingItem = prev.find((i) => Number(i.product_id) === productId);
    
                if (existingItem) {
                    // If the item already exists, update its quantity
                    return prev.map((i) =>
                        Number(i.product_id) === productId ? { ...i, quantity: Number(i.quantity || 0) + quantity } : i
                    );
                }
    
                // If it's a new item, add it to the cart
                return [...prev, { ...item, product_id: productId, quantity }];
            });

            // Ensure we have canonical cart item fields (e.g. product_name, unit_price, total_price)
            // so UI (checkout totals/info) updates immediately without needing a reload.
            await refreshCartItems();
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            alert('Error adding product to cart. Please try again.');
        }
    };

    const increaseQuantity = async (productId) => {
        try {
            const currentItem = cartItems.find((item) => item.product_id === productId);
            const newQuantity = currentItem.quantity + 1;

            // Call your backend API to update the quantity
            await axiosInstance.put(
                `/client/cart/update`,
                {
                    productId,
                    quantity: newQuantity,
                }
            );

            // Update local state
            setCartItems((prevItems) =>
                prevItems.map((item) => (item.product_id === productId ? { ...item, quantity: newQuantity } : item))
            );

            await refreshCartItems();
        } catch (error) {
            console.error('Failed to increase quantity:', error);
        }
    };

    const decreaseQuantity = async (productId) => {
        try {
            const currentItem = cartItems.find((item) => item.product_id === productId);

            if (currentItem.quantity > 1) {
                const newQuantity = currentItem.quantity - 1;

                // Call your backend API to update the quantity
                await axiosInstance.put(
                    `/client/cart/update`,
                    {
                        productId,
                        quantity: newQuantity,
                    }
                );

                // Update local state
                setCartItems((prevItems) =>
                    prevItems.map((item) => (item.product_id === productId ? { ...item, quantity: newQuantity } : item))
                );

                await refreshCartItems();
            }
        } catch (error) {
            console.error('Failed to decrease quantity:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axiosInstance.delete('/client/cart/remove', { data: { productId } });

            // Update local cart state by filtering out the removed item
            setCartItems((prev) => prev.filter((item) => item.product_id !== productId));

            await refreshCartItems();
        } catch (error) {
            console.error('Failed to remove product from cart:', error);
        }
    };

    return (
      <CartContext.Provider value={{ cartItems, addToCart, setCartItems, removeFromCart, increaseQuantity, decreaseQuantity }}>
      {children}
  </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
