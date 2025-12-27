/**
 * AI Chat Button Component
 * Purpose: Floating button that opens AI chat window
 * Position: Bottom-right corner of screen
 */

import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

const AIChatButton = ({ onClick, unreadCount = 0 }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Open AI Shopping Assistant"
        >
            <div className="relative">
                {/* Main button */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform group-hover:scale-110 flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    <MessageCircle className="w-6 h-6" />
                </div>

                {/* Unread count badge */}
                {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                )}

                {/* Pulse animation */}
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                    💬 AI Shopping Assistant
                    <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                </div>
            </div>
        </button>
    );
};

export default AIChatButton;
