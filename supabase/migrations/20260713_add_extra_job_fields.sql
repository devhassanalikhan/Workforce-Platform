-- ============================================================
-- Migration: Add extra OES job fields
-- ============================================================

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS published_on TEXT,
  ADD COLUMN IF NOT EXISTS job_nature TEXT,
  ADD COLUMN IF NOT EXISTS project TEXT,
  ADD COLUMN IF NOT EXISTS age_limit TEXT,
  ADD COLUMN IF NOT EXISTS field_of_work TEXT,
  ADD COLUMN IF NOT EXISTS available_till TEXT,
  ADD COLUMN IF NOT EXISTS qualifications TEXT,
  ADD COLUMN IF NOT EXISTS note TEXT,
  ADD COLUMN IF NOT EXISTS terms_applied BOOLEAN DEFAULT TRUE;
