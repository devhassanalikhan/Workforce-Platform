-- ============================================================
-- Migration: Fix company-logos bucket visibility.
--
-- 20260716_company_signup_storage_and_fields.sql created this bucket with
-- `INSERT ... ON CONFLICT (id) DO NOTHING`, which silently no-ops if the
-- bucket already existed (it did, as private) — so it never actually
-- became public. Uploads and DB writes succeeded, but every stored
-- logo_url 400'd with "Bucket not found" when read, since public reads
-- only work against a bucket marked public.
-- ============================================================

UPDATE storage.buckets
SET public = true
WHERE id = 'company-logos';
