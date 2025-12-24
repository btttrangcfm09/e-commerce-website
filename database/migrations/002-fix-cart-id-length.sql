-- Migration: Fix cart_id length mismatch
-- Issue: cart_items.cart_id is character(50) but carts.id is character(255)
-- This causes "value too long for type character(50)" error

BEGIN;

-- Drop FK temporarily so we can change the type safely
ALTER TABLE public.cart_items
    DROP CONSTRAINT IF EXISTS fk_cart_id;

-- Step 1: Change cart_items.cart_id to character(255)
ALTER TABLE public.cart_items
    ALTER COLUMN cart_id TYPE character(255);

-- Step 2: Change cart_items.id to character(255) for consistency
ALTER TABLE public.cart_items
    ALTER COLUMN id TYPE character(255);

-- Re-create FK
ALTER TABLE public.cart_items
    ADD CONSTRAINT fk_cart_id FOREIGN KEY (cart_id) REFERENCES public.carts(id);

COMMIT;
