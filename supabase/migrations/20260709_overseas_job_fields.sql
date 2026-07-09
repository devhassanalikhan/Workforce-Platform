-- ============================================================
-- Migration: Overseas job listing fields
-- ============================================================
-- Adds international employment metadata used by employer-created
-- overseas job listings. Safe to run repeatedly.
-- ============================================================

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS destination_country TEXT,
  ADD COLUMN IF NOT EXISTS destination_city TEXT,
  ADD COLUMN IF NOT EXISTS visa_status TEXT,
  ADD COLUMN IF NOT EXISTS contract_duration TEXT,
  ADD COLUMN IF NOT EXISTS oep_license_no TEXT,
  ADD COLUMN IF NOT EXISTS benefits TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS salary_frequency TEXT NOT NULL DEFAULT 'monthly';

