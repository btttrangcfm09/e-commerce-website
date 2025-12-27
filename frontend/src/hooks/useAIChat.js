/**
 * useAIChat Hook
 * Purpose: Manage AI chat state and interactions
 * Provides easy-to-use interface for chat functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { aiChatService } from '../services/ai-chat';
import { useCart } from '../components/features/cart/CartContext/CartContext';
import { toast } from 'sonner';

const useAIChat = () => {
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [products, setProducts] = useState({}); // Keyed by message ID
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { addToCart } = useCart();

    /**
     * Initialize chat session
     * Called when chat is first opened
     */
    const initializeSession = useCallback(async () => {
        try {
            // Check if we already have a session in localStorage
            const storedSessionId = localStorage.getItem('ai_chat_session_id');
            
            if (storedSessionId) {
                // Try to load existing session
                try {
                    const response = await aiChatService.getSessionMessages(storedSessionId);
                    setSessionId(storedSessionId);
                    setMessages(response.data || []);
                    return;
                } catch (err) {
                    // Session might be expired, create new one
                    localStorage.removeItem('ai_chat_session_id');
                }
            }

            // Create new session
            const response = await aiChatService.createSession();
            const newSessionId = response.data.sessionId;
            
            setSessionId(newSessionId);
            localStorage.setItem('ai_chat_session_id', newSessionId);

            // Add greeting message
            setMessages([{
                id: 'greeting',
                role: 'assistant',
                content: response.data.greeting,
                createdAt: response.data.createdAt
            }]);

        } catch (err) {
            console.error('Error initializing session:', err);
            setError('Failed to initialize chat session');
            toast.error('Không thể khởi tạo chat. Vui lòng thử lại!');
        }
    }, []);

    /**
     * Send a message to AI and get response
     */
    const sendMessage = useCallback(async (message) => {
        if (!sessionId) {
            await initializeSession();
            return;
        }

        if (!message.trim()) {
            return;
        }

        // Add user message to UI immediately
        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: message,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);

        setIsLoading(true);
        setError(null);

        try {
            const response = await aiChatService.sendMessage(sessionId, message);
            
            if (response.success) {
                const { message: aiMessage, products: suggestedProducts } = response.data;

                // Add AI message
                setMessages(prev => [...prev, {
                    id: aiMessage.id,
                    role: 'assistant',
                    content: aiMessage.content,
                    createdAt: aiMessage.createdAt
                }]);

                // Store products for this message
                if (suggestedProducts && suggestedProducts.length > 0) {
                    setProducts(prev => ({
                        ...prev,
                        [aiMessage.id]: suggestedProducts
                    }));
                }
            }

        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
            
            // Add error message
            setMessages(prev => [...prev, {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: 'Xin lỗi, tôi đang gặp chút vấn đề. Vui lòng thử lại! 😔',
                createdAt: new Date().toISOString()
            }]);

            toast.error('Không thể gửi tin nhắn. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, initializeSession]);

    /**
     * Track when user views a product
     */
    const trackProductView = useCallback(async (productId) => {
        if (!sessionId) return;

        // Find the last assistant message
        const lastAssistantMessage = [...messages]
            .reverse()
            .find(m => m.role === 'assistant');

        if (lastAssistantMessage) {
            await aiChatService.trackInteraction(
                sessionId,
                lastAssistantMessage.id,
                productId,
                'viewed'
            );
        }
    }, [sessionId, messages]);

    /**
     * Add product to cart from AI suggestion
     */
    const addProductToCart = useCallback(async (product) => {
        try {
            await addToCart(product.id, 1);
            toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);

            // Track interaction
            if (sessionId) {
                const lastAssistantMessage = [...messages]
                    .reverse()
                    .find(m => m.role === 'assistant');

                if (lastAssistantMessage) {
                    await aiChatService.trackInteraction(
                        sessionId,
                        lastAssistantMessage.id,
                        product.id,
                        'added_to_cart'
                    );
                }
            }

        } catch (err) {
            console.error('Error adding to cart:', err);
            toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại!');
        }
    }, [addToCart, sessionId, messages]);

    /**
     * Clear chat session
     */
    const clearSession = useCallback(() => {
        if (sessionId) {
            localStorage.removeItem('ai_chat_session_id');
        }
        setSessionId(null);
        setMessages([]);
        setProducts({});
        setError(null);
    }, [sessionId]);

    /**
     * Initialize session on mount
     */
    useEffect(() => {
        initializeSession();
    }, [initializeSession]);

    return {
        sessionId,
        messages,
        products,
        isLoading,
        error,
        sendMessage,
        trackProductView,
        addProductToCart,
        clearSession,
        initializeSession
    };
};

export default useAIChat;
