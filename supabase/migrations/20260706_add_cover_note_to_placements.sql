-- Migration: Add cover_note to placements table
-- Run this in Supabase SQL Editor
ALTER TABLE public.placements
  ADD COLUMN IF NOT EXISTS cover_note TEXT;
