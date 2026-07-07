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
