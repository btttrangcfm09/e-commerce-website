-- Migration: Fix cart_id length mismatch
-- Issue: cart_items.cart_id is character(16) but carts.id is character(255)
-- This causes "value too long for type character(16)" error

-- Step 1: Change cart_items.cart_id from character(16) to character(255)
ALTER TABLE cart_items 
ALTER COLUMN cart_id TYPE character(255);

-- Step 2: Change cart_items.id from character(24) to character(255) for consistency
ALTER TABLE cart_items 
ALTER COLUMN id TYPE character(255);

-- Verification
-- Run these to verify the changes:
-- \d cart_items
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'cart_items';