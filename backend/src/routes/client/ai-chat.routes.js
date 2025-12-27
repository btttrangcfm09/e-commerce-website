/**
 * AI Chat Routes
 * Purpose: Define API endpoints for AI shopping assistant
 * All routes are prefixed with /client/ai-chat
 */

const express = require('express');
const router = express.Router();
const aiChatController = require('../../controllers/client/ai-chat.controller');
const { optionalAuth } = require('../../middleware/auth/optional-auth.middleware');

// Health check - no auth required
router.get('/health', aiChatController.healthCheck.bind(aiChatController));

// Create new chat session - works for both logged-in and guest users
router.post('/sessions', 
    optionalAuth, 
    aiChatController.createSession.bind(aiChatController)
);

// Get chat history for a session
router.get('/sessions/:sessionId/messages', 
    aiChatController.getSessionMessages.bind(aiChatController)
);

// Send message and get AI response
router.post('/sessions/:sessionId/messages', 
    aiChatController.sendMessage.bind(aiChatController)
);

// Get user's chat sessions (requires authentication)
router.get('/sessions', 
    optionalAuth, 
    aiChatController.getUserSessions.bind(aiChatController)
);

// Track product interaction (analytics)
router.post('/track', 
    aiChatController.trackInteraction.bind(aiChatController)
);

// Delete a chat session
router.delete('/sessions/:sessionId', 
    optionalAuth, 
    aiChatController.deleteSession.bind(aiChatController)
);

module.exports = router;
