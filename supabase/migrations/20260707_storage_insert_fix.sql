-- ============================================================
-- Migration: Fix missing INSERT policy for applicant-docs bucket
-- Path: supabase/migrations/20260707_storage_insert_fix.sql
-- ============================================================

DROP POLICY IF EXISTS "Allow authenticated uploads to applicant-docs" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to applicant-docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'applicant-docs'
    AND name LIKE (auth.uid()::text || '/%')
  );

-- 
CREATE TABLE public.demo_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  company     text NOT NULL,
  message     text,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Anyone — including logged-out visitors — can submit a demo request.
-- This is a public lead-capture form, not a data table needing ownership checks.
CREATE POLICY "demo_requests_insert_public" ON public.demo_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view submitted leads.
CREATE POLICY "demo_requests_select_admin" ON public.demo_requests
FOR SELECT USING (get_my_role() = 'admin');