/**
 * Chat Message Component
 * Purpose: Display individual chat messages (user or assistant)
 * Shows message content with appropriate styling
 */

import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message, isUser }) => {
    return (
        <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar */}
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                </div>
            )}

            {/* Message bubble */}
            <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                </p>

                {/* Timestamp */}
                <p
                    className={`text-xs mt-1 ${
                        isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                >
                    {new Date(message.created_at || message.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>

            {/* User avatar */}
            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-700" />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
