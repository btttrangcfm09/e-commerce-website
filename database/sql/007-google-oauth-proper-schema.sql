-- ============================================
-- Migration: Proper Google OAuth Schema
-- Description: Support both local and OAuth login
-- ============================================

-- 1. Allow NULL password (for OAuth users)
ALTER TABLE users 
ALTER COLUMN password DROP NOT NULL;

-- 2. Add google_id column if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'google_id'
    ) THEN
        ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;
        CREATE INDEX idx_users_google_id ON users(google_id);
    END IF;
END $$;

-- 3. Add provider column (local, google, facebook, etc.)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'provider'
    ) THEN
        ALTER TABLE users ADD COLUMN provider VARCHAR(20) NOT NULL DEFAULT 'local';
    END IF;
END $$;

-- 4. Add comments for documentation
COMMENT ON COLUMN users.password IS 'Password hash. NULL for OAuth users';
COMMENT ON COLUMN users.google_id IS 'Google OAuth ID. NULL for local users';
COMMENT ON COLUMN users.provider IS 'Auth provider: local, google, facebook, etc. Can be comma-separated for linked accounts';

-- 5. Update existing users
-- Set provider for existing users based on their data
UPDATE users 
SET provider = CASE 
    WHEN google_id IS NOT NULL THEN 'google'
    ELSE 'local'
END
WHERE provider = 'local';

-- 6. Optional: Create a function to check login method availability
CREATE OR REPLACE FUNCTION can_login_with_password(user_id VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = user_id AND password IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION can_login_with_google(user_id VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = user_id AND google_id IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Users can now login with password, Google OAuth, or both';
END $$;
