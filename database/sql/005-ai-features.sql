-- ====================================
-- AI SHOPPING ASSISTANT MIGRATION
-- Created: 2025-12-27
-- Description: Tables for AI chat functionality
-- ====================================

-- Table: ai_chat_sessions
-- Purpose: Store chat sessions for each user
-- Each session represents a conversation thread
CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
    id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),  -- NULL for guest users
    session_title VARCHAR(500),  -- Optional: "Tìm váy dự tiệc"
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT pk_ai_chat_sessions PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Table: ai_chat_messages
-- Purpose: Store individual messages in a chat session
-- Includes both user questions and AI responses
CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
    id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,  -- 'user' or 'assistant'
    content TEXT NOT NULL,
    suggested_product_ids INTEGER[],  -- Array of product IDs suggested by AI
    metadata JSONB,  -- Store additional data like user preferences, filters used, etc.
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_ai_chat_messages PRIMARY KEY (id),
    CONSTRAINT fk_session_id FOREIGN KEY (session_id) REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
    CONSTRAINT chk_role CHECK (role IN ('user', 'assistant'))
);

-- Table: ai_product_interactions
-- Purpose: Track which products users interact with after AI suggestions
-- This helps improve recommendations over time
CREATE TABLE IF NOT EXISTS public.ai_product_interactions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    message_id VARCHAR(255) NOT NULL,
    product_id INTEGER NOT NULL,
    interaction_type VARCHAR(50) NOT NULL,  -- 'viewed', 'clicked', 'added_to_cart', 'purchased'
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_session_id FOREIGN KEY (session_id) REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_message_id FOREIGN KEY (message_id) REFERENCES public.ai_chat_messages(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- ====================================
-- INDEXES FOR PERFORMANCE
-- ====================================

-- Index for finding user's chat sessions
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user_id ON public.ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_created_at ON public.ai_chat_sessions(created_at DESC);

-- Index for finding messages in a session
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON public.ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_created_at ON public.ai_chat_messages(created_at);

-- Index for tracking product interactions
CREATE INDEX IF NOT EXISTS idx_ai_product_interactions_session_id ON public.ai_product_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_product_interactions_product_id ON public.ai_product_interactions(product_id);

-- ====================================
-- ADD AI-FRIENDLY COLUMNS TO PRODUCTS
-- ====================================

-- Add tags column for better AI matching
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add detailed description for AI to understand products better
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS ai_description TEXT;

-- Create GIN index for tags array searching
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING GIN(tags);

-- ====================================
-- SAMPLE DATA FOR TESTING
-- ====================================

-- Note: You can manually add tags to products later via UPDATE statements
-- Example:
-- UPDATE public.products SET tags = ARRAY['shirt', 'men', 'office'] WHERE id = 1;
-- UPDATE public.products SET tags = ARRAY['dress', 'women', 'party'] WHERE id = 2;

-- Skipping Vietnamese characters in migration to avoid encoding issues
-- You can add Vietnamese tags via application or pgAdmin after migration

-- ====================================
-- COMMENTS FOR DOCUMENTATION
-- ====================================

COMMENT ON TABLE public.ai_chat_sessions IS 'Store AI chat sessions for shopping assistance';
COMMENT ON TABLE public.ai_chat_messages IS 'Store individual messages in AI chat conversations';
COMMENT ON TABLE public.ai_product_interactions IS 'Track user interactions with AI-suggested products';

COMMENT ON COLUMN public.products.tags IS 'Product tags for AI-powered search and matching';
COMMENT ON COLUMN public.products.ai_description IS 'Detailed product description for AI understanding';
