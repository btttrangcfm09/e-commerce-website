import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);

    // Fetch cart items from API when the component mounts
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const userId = localStorage.getItem('userId'); // Get user ID from local storage
                const response = await axiosInstance.get(`/client/cart/info`, {
                    headers: {
                        Authorization: `Bearer ${userId}`, // Include authorization header if needed
                    },
                });

                // Set cart items based on the API response structure
                if (Array.isArray(response.data.cart_items)) {
                    setCartItems(response.data.cart_items);
                } else {
                    console.error('Unexpected response structure:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch cart items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const addToCart = async (item) => {
        try {
            const userId = localStorage.getItem('userId');
            await axiosInstance.post(
                `/client/cart/add`,
                {
                    productId: item.id,
                    quantity: item.quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userId}`,
                    },
                }
            );
    
            // Immediately update local cart state
            setCartItems((prev) => {
                const existingItem = prev.find((i) => i.product_id === item.id);
    
                if (existingItem) {
                    // If the item already exists, update its quantity
                    return prev.map((i) =>
                        i.product_id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                    );
                }
    
                // If it's a new item, add it to the cart
                return [...prev, { ...item, quantity: item.quantity }];
            });
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            alert('Error adding product to cart. Please try again.');
        }
    };

    const increaseQuantity = async (productId) => {
        try {
            const userId = localStorage.getItem('userId');
            const currentItem = cartItems.find((item) => item.product_id === productId);
            const newQuantity = currentItem.quantity + 1;

            // Call your backend API to update the quantity
            await axiosInstance.put(
                `/client/cart/update`,
                {
                    productId,
                    quantity: newQuantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userId}`,
                    },
                }
            );

            // Update local state
            setCartItems((prevItems) =>
                prevItems.map((item) => (item.product_id === productId ? { ...item, quantity: newQuantity } : item))
            );
        } catch (error) {
            console.error('Failed to increase quantity:', error);
        }
    };

    const decreaseQuantity = async (productId) => {
        try {
            const userId = localStorage.getItem('userId');
            const currentItem = cartItems.find((item) => item.product_id === productId);

            if (currentItem.quantity > 1) {
                const newQuantity = currentItem.quantity - 1;

                // Call your backend API to update the quantity
                await axiosInstance.put(
                    `/client/cart/update`,
                    {
                        productId,
                        quantity: newQuantity,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userId}`,
                        },
                    }
                );

                // Update local state
                setCartItems((prevItems) =>
                    prevItems.map((item) => (item.product_id === productId ? { ...item, quantity: newQuantity } : item))
                );
            }
        } catch (error) {
            console.error('Failed to decrease quantity:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const userId = localStorage.getItem('userId');
            await axiosInstance.delete(`/client/cart/remove`, {
                headers: {
                    Authorization: `Bearer ${userId}`,
                },
                data: { productId },
            });

            // Update local cart state by filtering out the removed item
            setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
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
