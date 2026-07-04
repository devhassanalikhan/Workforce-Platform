-- ============================================================
-- Migration: Schema fixes + scraper support
-- Run this in Supabase SQL Editor
-- ============================================================
-- Safe to run: all statements use IF NOT EXISTS / IF EXISTS guards
-- Does NOT recreate existing tables — only adds missing pieces
-- ============================================================




-- ================================================================
-- FIX 1: grievances.resolution_note
--
-- mutations.ts resolveGrievance() sends { status, resolution_note }
-- but the column doesn't exist — this causes a PostgREST 400 error.
-- ================================================================
ALTER TABLE public.grievances
  ADD COLUMN IF NOT EXISTS resolution_note TEXT;


-- ================================================================
-- FIX 2: saved_jobs RLS policies
--
-- The table exists with RLS enabled but has no policies defined,
-- meaning ALL reads/writes are blocked for authenticated users.
-- ================================================================
DROP POLICY IF EXISTS "saved_jobs_select_own" ON public.saved_jobs;
CREATE POLICY "saved_jobs_select_own" ON public.saved_jobs
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "saved_jobs_insert_own" ON public.saved_jobs;
CREATE POLICY "saved_jobs_insert_own" ON public.saved_jobs
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "saved_jobs_delete_own" ON public.saved_jobs;
CREATE POLICY "saved_jobs_delete_own" ON public.saved_jobs
  FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "saved_jobs_all_admin" ON public.saved_jobs;
CREATE POLICY "saved_jobs_all_admin" ON public.saved_jobs
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));


-- ================================================================
-- FEATURE: Scraper columns on jobs
--
-- Adds fields needed to ingest scraped jobs from BEOE and other
-- sources. The unique index on (source, external_id) prevents
-- duplicate rows when the scraper runs repeatedly.
-- ================================================================
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS source       TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS source_url   TEXT,
  ADD COLUMN IF NOT EXISTS external_id  TEXT,
  ADD COLUMN IF NOT EXISTS scraped_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_verified  BOOLEAN NOT NULL DEFAULT false;

-- Deduplication: one row per (source, external_id) pair
CREATE UNIQUE INDEX IF NOT EXISTS jobs_source_external_id_idx
  ON public.jobs (source, external_id)
  WHERE external_id IS NOT NULL;


-- ================================================================
-- FEATURE: scraper_runs audit table
--
-- Each Edge Function invocation writes one row so admins can see
-- when the scraper last ran, how many jobs it found, and whether
-- it succeeded or failed.
-- ================================================================
CREATE TABLE IF NOT EXISTS public.scraper_runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source        TEXT NOT NULL DEFAULT 'beoe',
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  jobs_found    INT NOT NULL DEFAULT 0,
  jobs_inserted INT NOT NULL DEFAULT 0,
  jobs_updated  INT NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'running'
                CHECK (status IN ('running', 'success', 'failed')),
  error_message TEXT
);

ALTER TABLE public.scraper_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scraper_runs_all_admin" ON public.scraper_runs;
CREATE POLICY "scraper_runs_all_admin" ON public.scraper_runs
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- The Edge Function uses the service_role key (bypasses RLS),
-- so no INSERT policy for authenticated users is needed.


-- ================================================================
-- PERFORMANCE: indexes for the most common query patterns
-- ================================================================
CREATE INDEX IF NOT EXISTS jobs_posted_at_idx        ON public.jobs (posted_at DESC);
CREATE INDEX IF NOT EXISTS jobs_source_idx           ON public.jobs (source);
CREATE INDEX IF NOT EXISTS placements_talent_id_idx  ON public.placements (talent_id);
CREATE INDEX IF NOT EXISTS placements_stage_idx      ON public.placements (stage);
CREATE INDEX IF NOT EXISTS deployments_placement_idx ON public.deployments (placement_id);
CREATE INDEX IF NOT EXISTS grievances_deployment_idx ON public.grievances (deployment_id);
CREATE INDEX IF NOT EXISTS enrollments_talent_idx    ON public.training_enrollments (talent_id);
CREATE INDEX IF NOT EXISTS blog_published_at_idx     ON public.blog_articles (published_at DESC);
