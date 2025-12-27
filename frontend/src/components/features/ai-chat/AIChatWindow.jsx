/**
 * AI Chat Window Component
 * Purpose: Main chat interface with messages, input, and product suggestions
 * Full-featured chat UI with auto-scroll and loading states
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ProductSuggestionCard from './ProductSuggestionCard';
import useAIChat from '../../../hooks/useAIChat';

const AIChatWindow = ({ isOpen, onClose }) => {
    const {
        messages,
        products,
        isLoading,
        sendMessage,
        trackProductView,
        addProductToCart
    } = useAIChat();

    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, products]);

    // Focus input when window opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) {
            return;
        }

        const message = inputMessage.trim();
        setInputMessage('');

        await sendMessage(message);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // Quick action buttons
    const quickActions = [
        { label: '👗 Váy dự tiệc', query: 'Tôi muốn tìm váy dự tiệc sang trọng' },
        { label: '👔 Áo sơ mi nam', query: 'Tìm áo sơ mi nam công sở' },
        { label: '👟 Giày thể thao', query: 'Giày thể thao nam nữ giá tốt' },
        { label: '👜 Túi xách', query: 'Túi xách nữ đẹp' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 w-[420px] h-[650px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">AI Shopping Assistant</h3>
                        <p className="text-xs text-blue-100">Trợ lý mua sắm thông minh</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                    aria-label="Close chat"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {/* Welcome message */}
                {messages.length === 0 && (
                    <div className="text-center py-8">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                            Xin chào! 👋
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Tôi là trợ lý AI. Hãy cho tôi biết bạn đang tìm gì!
                        </p>

                        {/* Quick actions */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setInputMessage(action.query);
                                        inputRef.current?.focus();
                                    }}
                                    className="text-xs bg-white hover:bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-left transition-colors"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                {messages.map((message, index) => (
                    <div key={message.id || index}>
                        <ChatMessage
                            message={message}
                            isUser={message.role === 'user'}
                        />

                        {/* Show products after assistant's message */}
                        {message.role === 'assistant' && products[message.id] && (
                            <div className="mb-4 ml-11">
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    {products[message.id].map((product) => (
                                        <ProductSuggestionCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={addProductToCart}
                                            onTrackView={trackProductView}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex gap-3 mb-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        maxLength={1000}
                    />
                    <button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                        aria-label="Send message"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </form>

                {/* Character count */}
                <p className="text-xs text-gray-500 mt-1 text-right">
                    {inputMessage.length}/1000
                </p>
            </div>
        </div>
    );
};

export default AIChatWindow;
