-- Migration: Add profile image column to users
-- Purpose: Enable upload/delete profile image feature

BEGIN;

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS image text;

COMMIT;
