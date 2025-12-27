-- ====================================
-- PRODUCT RECOMMENDATIONS MIGRATION
-- Created: 2025-12-27
-- Description: Tables and functions for smart product recommendations
-- ====================================

-- Table: product_views
-- Purpose: Track when users view products (for "Recently Viewed" and personalized recommendations)
CREATE TABLE IF NOT EXISTS public.product_views (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),  -- NULL for guest users
    product_id INTEGER NOT NULL,
    viewed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    session_id VARCHAR(255),  -- Track guest sessions
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- Table: product_similarities
-- Purpose: Precomputed product similarity scores for faster recommendations
-- This can be populated by a background job analyzing product relationships
CREATE TABLE IF NOT EXISTS public.product_similarities (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    similar_product_id INTEGER NOT NULL,
    similarity_score DECIMAL(5,4) NOT NULL DEFAULT 0.0,  -- 0.0 to 1.0
    similarity_type VARCHAR(50),  -- 'category', 'tags', 'collaborative', 'purchased_together'
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
    CONSTRAINT fk_similar_product_id FOREIGN KEY (similar_product_id) REFERENCES public.products(id) ON DELETE CASCADE,
    CONSTRAINT unique_product_pair UNIQUE (product_id, similar_product_id, similarity_type)
);

-- ====================================
-- INDEXES FOR PERFORMANCE
-- ====================================

-- Index for finding user's view history
CREATE INDEX IF NOT EXISTS idx_product_views_user_id ON public.product_views(user_id);
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON public.product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON public.product_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_views_session_id ON public.product_views(session_id);

-- Composite index for user + time based queries
CREATE INDEX IF NOT EXISTS idx_product_views_user_time ON public.product_views(user_id, viewed_at DESC);

-- Index for similarity lookups
CREATE INDEX IF NOT EXISTS idx_product_similarities_product_id ON public.product_similarities(product_id, similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_product_similarities_score ON public.product_similarities(similarity_score DESC);

-- ====================================
-- COMMENTS FOR DOCUMENTATION
-- ====================================

COMMENT ON TABLE public.product_views IS 'Track user product viewing history for recommendations - all logic handled in backend';
COMMENT ON TABLE public.product_similarities IS 'Optional: Precomputed product similarity scores for fast recommendations';

COMMENT ON COLUMN public.product_views.session_id IS 'Track guest user sessions for anonymous recommendations';
COMMENT ON COLUMN public.product_similarities.similarity_score IS 'Score from 0.0 to 1.0 indicating how similar products are';
COMMENT ON COLUMN public.product_similarities.similarity_type IS 'Method used to calculate similarity: category, tags, collaborative, purchased_together';

-- ====================================
-- NOTES
-- ====================================
-- All recommendation logic is implemented in backend (Node.js)
-- No stored procedures or functions - pure SQL queries from backend
-- This keeps business logic in application layer for easier maintenance and testing
