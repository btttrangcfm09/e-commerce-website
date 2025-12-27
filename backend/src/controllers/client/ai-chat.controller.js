/**
 * AI Chat Controller
 * Purpose: Handle HTTP requests for AI shopping assistant
 * Maps requests to service methods
 */

const aiChatService = require('../../services/ai/ai-chat.service');

class AIChatController {
    /**
     * POST /client/ai-chat/sessions
     * Create a new chat session
     */
    async createSession(req, res) {
        try {
            // Get user ID from authenticated session (if logged in)
            const userId = req.user?.id || null;

            const result = await aiChatService.createSession(userId);

            res.status(201).json({
                success: true,
                message: 'Chat session created successfully',
                data: result
            });

        } catch (error) {
            console.error('Error in createSession controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create chat session',
                error: error.message
            });
        }
    }

    /**
     * GET /client/ai-chat/sessions/:sessionId/messages
     * Get chat history for a session
     */
    async getSessionMessages(req, res) {
        try {
            const { sessionId } = req.params;
            const limit = parseInt(req.query.limit) || 50;

            const messages = await aiChatService.getSessionMessages(sessionId, limit);

            res.status(200).json({
                success: true,
                data: messages
            });

        } catch (error) {
            console.error('Error in getSessionMessages controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve messages',
                error: error.message
            });
        }
    }

    /**
     * POST /client/ai-chat/sessions/:sessionId/messages
     * Send a message and get AI response
     */
    async sendMessage(req, res) {
        try {
            const { sessionId } = req.params;
            const { message } = req.body;

            // Validation
            if (!message || message.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Message content is required'
                });
            }

            if (message.length > 1000) {
                return res.status(400).json({
                    success: false,
                    message: 'Message is too long (max 1000 characters)'
                });
            }

            // Process query
            const result = await aiChatService.processUserQuery(sessionId, message.trim());

            res.status(200).json({
                success: true,
                message: 'Message processed successfully',
                data: result
            });

        } catch (error) {
            console.error('Error in sendMessage controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process message',
                error: error.message
            });
        }
    }

    /**
     * GET /client/ai-chat/sessions
     * Get user's chat sessions
     */
    async getUserSessions(req, res) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const limit = parseInt(req.query.limit) || 10;
            const sessions = await aiChatService.getUserSessions(userId, limit);

            res.status(200).json({
                success: true,
                data: sessions
            });

        } catch (error) {
            console.error('Error in getUserSessions controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve sessions',
                error: error.message
            });
        }
    }

    /**
     * POST /client/ai-chat/track
     * Track product interaction
     */
    async trackInteraction(req, res) {
        try {
            const { sessionId, messageId, productId, interactionType } = req.body;

            // Validation
            if (!sessionId || !messageId || !productId || !interactionType) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const validTypes = ['viewed', 'clicked', 'added_to_cart', 'purchased'];
            if (!validTypes.includes(interactionType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid interaction type'
                });
            }

            await aiChatService.trackProductInteraction(
                sessionId,
                messageId,
                productId,
                interactionType
            );

            res.status(200).json({
                success: true,
                message: 'Interaction tracked successfully'
            });

        } catch (error) {
            console.error('Error in trackInteraction controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to track interaction',
                error: error.message
            });
        }
    }

    /**
     * DELETE /client/ai-chat/sessions/:sessionId
     * Delete a chat session
     */
    async deleteSession(req, res) {
        try {
            const { sessionId } = req.params;
            const userId = req.user?.id || null;

            await aiChatService.deleteSession(sessionId, userId);

            res.status(200).json({
                success: true,
                message: 'Session deleted successfully'
            });

        } catch (error) {
            console.error('Error in deleteSession controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete session',
                error: error.message
            });
        }
    }

    /**
     * GET /client/ai-chat/health
     * Check if AI service is available
     */
    async healthCheck(req, res) {
        try {
            const geminiService = require('../../services/ai/gemini.service');
            const isConfigured = !!geminiService.model;

            res.status(200).json({
                success: true,
                data: {
                    aiService: 'Google Gemini',
                    status: isConfigured ? 'configured' : 'not_configured',
                    message: isConfigured 
                        ? 'AI service is ready' 
                        : 'Please configure GEMINI_API_KEY in .env file'
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Health check failed',
                error: error.message
            });
        }
    }
}

module.exports = new AIChatController();
