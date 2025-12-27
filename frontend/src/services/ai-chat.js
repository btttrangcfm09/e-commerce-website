/**
 * AI Chat Service
 * Purpose: API calls for AI shopping assistant
 * Handles communication with backend endpoints
 */

import api from './api';

export const aiChatService = {
    /**
     * Create a new chat session
     */
    async createSession() {
        try {
            const response = await api.post('/client/ai-chat/sessions');
            return response.data;
        } catch (error) {
            console.error('Error creating chat session:', error);
            throw error;
        }
    },

    /**
     * Get messages for a session
     */
    async getSessionMessages(sessionId, limit = 50) {
        try {
            const response = await api.get(`/client/ai-chat/sessions/${sessionId}/messages`, {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting session messages:', error);
            throw error;
        }
    },

    /**
     * Send a message and get AI response
     */
    async sendMessage(sessionId, message) {
        try {
            const response = await api.post(`/client/ai-chat/sessions/${sessionId}/messages`, {
                message
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    /**
     * Get user's chat sessions
     */
    async getUserSessions(limit = 10) {
        try {
            const response = await api.get('/client/ai-chat/sessions', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting user sessions:', error);
            throw error;
        }
    },

    /**
     * Track product interaction
     */
    async trackInteraction(sessionId, messageId, productId, interactionType) {
        try {
            await api.post('/client/ai-chat/track', {
                sessionId,
                messageId,
                productId,
                interactionType
            });
        } catch (error) {
            console.error('Error tracking interaction:', error);
            // Don't throw error, tracking is not critical
        }
    },

    /**
     * Delete a chat session
     */
    async deleteSession(sessionId) {
        try {
            const response = await api.delete(`/client/ai-chat/sessions/${sessionId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error;
        }
    },

    /**
     * Check AI service health
     */
    async healthCheck() {
        try {
            const response = await api.get('/client/ai-chat/health');
            return response.data;
        } catch (error) {
            console.error('Error checking AI service health:', error);
            throw error;
        }
    }
};
