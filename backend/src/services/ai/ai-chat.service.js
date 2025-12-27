/**
 * AI Chat Service
 * Purpose: Main orchestrator for AI shopping assistant
 * Coordinates between Gemini AI and Product Matcher services
 */

const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const geminiService = require('./gemini.service');
const productMatcherService = require('./product-matcher.service');

class AIChatService {
    /**
     * Check if session exists in database
     */
    async checkSessionExists(sessionId) {
        try {
            const query = 'SELECT id FROM ai_chat_sessions WHERE id = $1';
            const result = await db.query(query, [sessionId]);
            return result.length > 0;
        } catch (error) {
            console.error('Error checking session:', error);
            return false;
        }
    }

    /**
     * Create a new chat session
     * Each user can have multiple chat sessions (conversation threads)
     */
    async createSession(userId = null) {
        try {
            const sessionId = uuidv4();
            const query = `
                INSERT INTO ai_chat_sessions (id, user_id, created_at, updated_at)
                VALUES ($1, $2, NOW(), NOW())
                RETURNING id, created_at
            `;
            
            const result = await db.query(query, [sessionId, userId]);
            
            // Send greeting message
            const greeting = await geminiService.generateGreeting();
            await this.addMessage(sessionId, 'assistant', greeting, null);

            return {
                sessionId: result[0].id,
                createdAt: result[0].created_at,
                greeting: greeting
            };

        } catch (error) {
            console.error('Error creating chat session:', error);
            throw new Error('Failed to create chat session');
        }
    }

    /**
     * Get chat history for a session
     * Returns all messages in chronological order
     */
    async getSessionMessages(sessionId, limit = 50) {
        try {
            const query = `
                SELECT 
                    id,
                    role,
                    content,
                    suggested_product_ids,
                    created_at
                FROM ai_chat_messages
                WHERE session_id = $1
                ORDER BY created_at ASC
                LIMIT $2
            `;

            const messages = await db.query(query, [sessionId, limit]);
            return messages;

        } catch (error) {
            console.error('Error getting session messages:', error);
            throw new Error('Failed to retrieve chat history');
        }
    }

    /**
     * Add a message to chat session
     * Used for both user messages and AI responses
     */
    async addMessage(sessionId, role, content, suggestedProductIds = null, metadata = null) {
        try {
            const messageId = uuidv4();
            const query = `
                INSERT INTO ai_chat_messages 
                (id, session_id, role, content, suggested_product_ids, metadata, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
                RETURNING id, created_at
            `;

            const result = await db.query(query, [
                messageId,
                sessionId,
                role,
                content,
                suggestedProductIds,
                metadata ? JSON.stringify(metadata) : null
            ]);

            // Update session timestamp
            await db.query(
                'UPDATE ai_chat_sessions SET updated_at = NOW() WHERE id = $1',
                [sessionId]
            );

            return {
                id: result[0].id,
                role,
                content,
                suggestedProductIds,
                createdAt: result[0].created_at
            };

        } catch (error) {
            console.error('Error adding message:', error);
            throw new Error('Failed to save message');
        }
    }

    /**
     * Process user query and generate AI response with product suggestions
     * This is the main entry point for chat functionality
     */
    async processUserQuery(sessionId, userQuery) {
        try {
            // 1. Save user's message
            await this.addMessage(sessionId, 'user', userQuery);

            // 2. Get chat history for context
            const chatHistory = await this.getSessionMessages(sessionId);

            // 3. Extract search criteria using AI
            const searchCriteria = await geminiService.extractSearchCriteria(userQuery);

            // 4. Find matching products
            let products = await productMatcherService.findMatchingProducts(searchCriteria, 5);

            // 5. If no products found, return message instead of fallback products
            if (products.length === 0) {
                const noProductsMessage = 'Xin lỗi, hiện tại cửa hàng không có sản phẩm phù hợp với yêu cầu của bạn. Bạn có thể thử tìm kiếm với các từ khóa khác hoặc duyệt qua các danh mục sản phẩm của chúng tôi.';
                
                const aiMessage = await this.addMessage(
                    sessionId,
                    'assistant',
                    noProductsMessage,
                    [],
                    { searchCriteria, noResults: true }
                );

                return {
                    message: aiMessage,
                    products: [],
                    searchCriteria,
                    noResults: true
                };
            }

            // 6. Format products
            const formattedProducts = productMatcherService.formatProducts(products);

            // 7. Generate AI explanation
            const explanation = await geminiService.generateProductExplanation(
                userQuery,
                formattedProducts,
                searchCriteria
            );

            // 8. Save AI response
            const productIds = formattedProducts.map(p => p.id);
            const aiMessage = await this.addMessage(
                sessionId,
                'assistant',
                explanation,
                productIds,
                { searchCriteria }
            );

            return {
                message: aiMessage,
                products: formattedProducts,
                searchCriteria
            };

        } catch (error) {
            console.error('Error processing user query:', error);

            // Fallback response on error
            const fallbackMessage = 'Xin lỗi, tôi đang gặp chút vấn đề kỹ thuật. Bạn có thể thử lại hoặc mô tả chi tiết hơn không?';
            await this.addMessage(sessionId, 'assistant', fallbackMessage);

            throw new Error('Failed to process query');
        }
    }

    /**
     * Get user's chat sessions
     * Useful for showing chat history
     */
    async getUserSessions(userId, limit = 10) {
        try {
            const query = `
                SELECT 
                    s.id,
                    s.session_title,
                    s.created_at,
                    s.updated_at,
                    (
                        SELECT content 
                        FROM ai_chat_messages 
                        WHERE session_id = s.id AND role = 'user'
                        ORDER BY created_at ASC 
                        LIMIT 1
                    ) as first_message
                FROM ai_chat_sessions s
                WHERE s.user_id = $1
                AND s.is_active = true
                ORDER BY s.updated_at DESC
                LIMIT $2
            `;

            return await db.query(query, [userId, limit]);

        } catch (error) {
            console.error('Error getting user sessions:', error);
            throw new Error('Failed to retrieve sessions');
        }
    }

    /**
     * Track product interaction
     * Records when users click/view products suggested by AI
     */
    async trackProductInteraction(sessionId, messageId, productId, interactionType) {
        try {
            const query = `
                INSERT INTO ai_product_interactions 
                (session_id, message_id, product_id, interaction_type, created_at)
                VALUES ($1, $2, $3, $4, NOW())
            `;

            await db.query(query, [sessionId, messageId, productId, interactionType]);

        } catch (error) {
            console.error('Error tracking product interaction:', error);
            // Don't throw error, tracking is not critical
        }
    }

    /**
     * Delete a chat session
     * Marks session as inactive (soft delete)
     */
    async deleteSession(sessionId, userId) {
        try {
            const query = `
                UPDATE ai_chat_sessions 
                SET is_active = false 
                WHERE id = $1 
                AND (user_id = $2 OR user_id IS NULL)
            `;

            await db.query(query, [sessionId, userId]);

        } catch (error) {
            console.error('Error deleting session:', error);
            throw new Error('Failed to delete session');
        }
    }
}

module.exports = new AIChatService();
