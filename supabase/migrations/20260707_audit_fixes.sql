-- ============================================================
-- Migration: Supabase Audit Fixes
-- Path: supabase/migrations/20260707_audit_fixes.sql
-- ============================================================

-- ── 1. ADD MISSING COLUMNS TO public.talent_profiles ──────────
ALTER TABLE public.talent_profiles
  ADD COLUMN IF NOT EXISTS experience_years INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS skills           TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS languages        TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS certifications   TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS verified         BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS available        BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS badge            TEXT;

-- ── 2. CREATE MISSING TABLES ──────────────────────────────────

-- TABLE: training_courses
CREATE TABLE IF NOT EXISTS public.training_courses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  category       TEXT NOT NULL,
  image_url      TEXT,
  duration       TEXT,
  level          TEXT,
  enrolled_count INT NOT NULL DEFAULT 0,
  rating         NUMERIC,
  provider       TEXT,
  price          TEXT,
  description    TEXT,
  modules        INT,
  certification  TEXT,
  skills         TEXT[] NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABLE: training_enrollments
CREATE TABLE IF NOT EXISTS public.training_enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id    UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  course_id    UUID NOT NULL REFERENCES public.training_courses(id) ON DELETE CASCADE,
  progress     INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (talent_id, course_id)
);

-- ── 3. ENABLE ROW LEVEL SECURITY ──────────────────────────────
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;

-- ── 4. RLS POLICIES FOR NEW TABLES ────────────────────────────

-- training_courses
DROP POLICY IF EXISTS "training_courses_select" ON public.training_courses;
CREATE POLICY "training_courses_select" ON public.training_courses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "training_courses_all_admin" ON public.training_courses;
CREATE POLICY "training_courses_all_admin" ON public.training_courses
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- training_enrollments
DROP POLICY IF EXISTS "enrollments_select" ON public.training_enrollments;
CREATE POLICY "enrollments_select" ON public.training_enrollments
  FOR SELECT USING (
    talent_id = auth.uid()
    OR get_my_role() IN ('admin', 'super_admin')
  );

DROP POLICY IF EXISTS "enrollments_insert_own" ON public.training_enrollments;
CREATE POLICY "enrollments_insert_own" ON public.training_enrollments
  FOR INSERT WITH CHECK (
    talent_id = auth.uid()
    AND get_my_role() = 'applicant'
  );

DROP POLICY IF EXISTS "enrollments_update_own" ON public.training_enrollments;
CREATE POLICY "enrollments_update_own" ON public.training_enrollments
  FOR UPDATE USING (
    talent_id = auth.uid()
    AND get_my_role() = 'applicant'
  );

DROP POLICY IF EXISTS "enrollments_all_admin" ON public.training_enrollments;
CREATE POLICY "enrollments_all_admin" ON public.training_enrollments
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- ── 5. ADD MISSING UPDATE / DELETE RLS POLICIES ────────────────

-- compliance_checklist_items: Allow applicants and company employers to update checklist item details/status
DROP POLICY IF EXISTS "checklist_update" ON public.compliance_checklist_items;
CREATE POLICY "checklist_update" ON public.compliance_checklist_items
  FOR UPDATE USING (
    placement_id IN (
      SELECT id FROM public.placements
      WHERE talent_id = auth.uid()
         OR (
           get_my_role() = 'employer'
           AND job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
         )
    )
  ) WITH CHECK (
    placement_id IN (
      SELECT id FROM public.placements
      WHERE talent_id = auth.uid()
         OR (
           get_my_role() = 'employer'
           AND job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
         )
    )
  );

-- compliance_documents: Allow applicants to update (link) their uploaded documents
DROP POLICY IF EXISTS "docs_update_own" ON public.compliance_documents;
CREATE POLICY "docs_update_own" ON public.compliance_documents
  FOR UPDATE USING (
    uploaded_by = auth.uid()
  ) WITH CHECK (
    uploaded_by = auth.uid()
  );

-- deployments: Allow assigned worker and company employers to update check-in dates/wellbeing score/escrow
DROP POLICY IF EXISTS "deployments_update" ON public.deployments;
CREATE POLICY "deployments_update" ON public.deployments
  FOR UPDATE USING (
    placement_id IN (
      SELECT id FROM public.placements
      WHERE talent_id = auth.uid()
         OR (
           get_my_role() = 'employer'
           AND job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
         )
    )
  ) WITH CHECK (
    placement_id IN (
      SELECT id FROM public.placements
      WHERE talent_id = auth.uid()
         OR (
           get_my_role() = 'employer'
           AND job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
         )
    )
  );

-- placements: Allow employers and applicants to update pipeline stage / details
DROP POLICY IF EXISTS "placements_update" ON public.placements;
CREATE POLICY "placements_update" ON public.placements
  FOR UPDATE USING (
    talent_id = auth.uid()
    OR (
      get_my_role() = 'employer'
      AND job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
    )
  ) WITH CHECK (
    talent_id = auth.uid()
    OR (
      get_my_role() = 'employer'
      AND job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
    )
  );

-- placements: Allow employers and applicants to delete (cancel/withdraw) placements
DROP POLICY IF EXISTS "placements_delete" ON public.placements;
CREATE POLICY "placements_delete" ON public.placements
  FOR DELETE USING (
    talent_id = auth.uid()
    OR (
      get_my_role() = 'employer'
      AND job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
    )
  );

-- ── 6. STORAGE OBJECT POLICIES FOR applicant-docs ──────────────

-- Allow authenticated users to upload files to 'applicant-docs' bucket under their own folder
DROP POLICY IF EXISTS "Allow authenticated uploads to applicant-docs" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to applicant-docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'applicant-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to view their own documents
DROP POLICY IF EXISTS "Allow users to view own applicant-docs" ON storage.objects;
CREATE POLICY "Allow users to view own applicant-docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'applicant-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow employers and admins to view all documents
DROP POLICY IF EXISTS "Allow admins and employers to view applicant-docs" ON storage.objects;
CREATE POLICY "Allow admins and employers to view applicant-docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'applicant-docs'
    AND (
      get_my_role() IN ('admin', 'super_admin')
      OR get_my_role() = 'employer'
    )
  );
