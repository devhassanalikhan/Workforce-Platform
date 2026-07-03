-- ============================================================
-- RLS CRUD Policies — Workforce Platform
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── Helper: avoids recursion when employer checks company_members ──
CREATE OR REPLACE FUNCTION public.get_my_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.company_members WHERE user_id = auth.uid() LIMIT 1;
$$;

-- ── Helper: role check ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'role')::text;
$$;

-- ================================================================
-- TABLE: companies
-- ================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "companies_select" ON public.companies;
CREATE POLICY "companies_select" ON public.companies
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "companies_update_employer" ON public.companies;
CREATE POLICY "companies_update_employer" ON public.companies
  FOR UPDATE USING (
    get_my_role() = 'employer'
    AND id = get_my_company_id()
  )
  WITH CHECK (
    get_my_role() = 'employer'
    AND id = get_my_company_id()
  );

DROP POLICY IF EXISTS "companies_all_admin" ON public.companies;
CREATE POLICY "companies_all_admin" ON public.companies
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- ================================================================
-- TABLE: company_members
-- ================================================================
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "company_members_select_own" ON public.company_members;
CREATE POLICY "company_members_select_own" ON public.company_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR company_id = get_my_company_id()
    OR get_my_role() IN ('admin', 'super_admin')
  );

DROP POLICY IF EXISTS "company_members_all_admin" ON public.company_members;
CREATE POLICY "company_members_all_admin" ON public.company_members
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- ================================================================
-- TABLE: jobs
-- ================================================================
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs_select_all" ON public.jobs;
CREATE POLICY "jobs_select_all" ON public.jobs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "jobs_insert_employer" ON public.jobs;
CREATE POLICY "jobs_insert_employer" ON public.jobs
  FOR INSERT WITH CHECK (
    get_my_role() = 'employer'
    AND company_id = get_my_company_id()
  );

DROP POLICY IF EXISTS "jobs_update_employer" ON public.jobs;
CREATE POLICY "jobs_update_employer" ON public.jobs
  FOR UPDATE USING (
    get_my_role() = 'employer'
    AND company_id = get_my_company_id()
  )
  WITH CHECK (
    get_my_role() = 'employer'
    AND company_id = get_my_company_id()
  );

DROP POLICY IF EXISTS "jobs_delete_employer" ON public.jobs;
CREATE POLICY "jobs_delete_employer" ON public.jobs
  FOR DELETE USING (
    get_my_role() = 'employer'
    AND company_id = get_my_company_id()
  );

DROP POLICY IF EXISTS "jobs_all_admin" ON public.jobs;
CREATE POLICY "jobs_all_admin" ON public.jobs
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- ================================================================
-- TABLE: talent_profiles
-- ================================================================
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "talent_profiles_select" ON public.talent_profiles;
CREATE POLICY "talent_profiles_select" ON public.talent_profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "talent_profiles_insert_own" ON public.talent_profiles;
CREATE POLICY "talent_profiles_insert_own" ON public.talent_profiles
  FOR INSERT WITH CHECK (
    id = auth.uid()
    AND get_my_role() = 'applicant'
  );

DROP POLICY IF EXISTS "talent_profiles_update_own" ON public.talent_profiles;
CREATE POLICY "talent_profiles_update_own" ON public.talent_profiles
  FOR UPDATE USING (
    id = auth.uid()
    AND get_my_role() = 'applicant'
  )
  WITH CHECK (
    id = auth.uid()
    AND get_my_role() = 'applicant'
  );

DROP POLICY IF EXISTS "talent_profiles_all_admin" ON public.talent_profiles;
CREATE POLICY "talent_profiles_all_admin" ON public.talent_profiles
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- ================================================================
-- TABLE: placements
-- ================================================================
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "placements_select" ON public.placements;
CREATE POLICY "placements_select" ON public.placements
  FOR SELECT USING (
    talent_id = auth.uid()
    OR (
      get_my_role() = 'employer'
      AND job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
    )
    OR get_my_role() IN ('admin', 'super_admin')
  );

DROP POLICY IF EXISTS "placements_insert_applicant" ON public.placements;
CREATE POLICY "placements_insert_applicant" ON public.placements
  FOR INSERT WITH CHECK (
    talent_id = auth.uid()
    AND get_my_role() = 'applicant'
    AND stage = 1
  );

DROP POLICY IF EXISTS "placements_all_admin" ON public.placements;
CREATE POLICY "placements_all_admin" ON public.placements
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- ================================================================
-- TABLE: compliance_checklist_items
-- ================================================================
ALTER TABLE public.compliance_checklist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "checklist_select" ON public.compliance_checklist_items;
CREATE POLICY "checklist_select" ON public.compliance_checklist_items
  FOR SELECT USING (
    placement_id IN (
      SELECT id FROM public.placements
      WHERE talent_id = auth.uid()
         OR get_my_role() IN ('admin', 'super_admin')
         OR (
           get_my_role() = 'employer'
           AND job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
         )
    )
  );

DROP POLICY IF EXISTS "checklist_all_admin" ON public.compliance_checklist_items;
CREATE POLICY "checklist_all_admin" ON public.compliance_checklist_items
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- ================================================================
-- TABLE: deployments
-- ================================================================
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deployments_select" ON public.deployments;
CREATE POLICY "deployments_select" ON public.deployments
  FOR SELECT USING (
    placement_id IN (
      SELECT id FROM public.placements
      WHERE talent_id = auth.uid()
         OR get_my_role() IN ('admin', 'super_admin')
         OR (
           get_my_role() = 'employer'
           AND job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
         )
    )
  );

DROP POLICY IF EXISTS "deployments_all_admin" ON public.deployments;
CREATE POLICY "deployments_all_admin" ON public.deployments
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- ================================================================
-- TABLE: grievances
-- ================================================================
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "grievances_select" ON public.grievances;
CREATE POLICY "grievances_select" ON public.grievances
  FOR SELECT USING (
    get_my_role() IN ('admin', 'super_admin')
    OR deployment_id IN (
      SELECT d.id FROM public.deployments d
      JOIN public.placements p ON p.id = d.placement_id
      WHERE p.talent_id = auth.uid()
         OR (
           get_my_role() = 'employer'
           AND p.job_id IN (SELECT id FROM public.jobs WHERE company_id = get_my_company_id())
         )
    )
  );

DROP POLICY IF EXISTS "grievances_insert_applicant" ON public.grievances;
CREATE POLICY "grievances_insert_applicant" ON public.grievances
  FOR INSERT WITH CHECK (
    get_my_role() = 'applicant'
    AND deployment_id IN (
      SELECT d.id FROM public.deployments d
      JOIN public.placements p ON p.id = d.placement_id
      WHERE p.talent_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "grievances_update_admin" ON public.grievances;
CREATE POLICY "grievances_update_admin" ON public.grievances
  FOR UPDATE USING (get_my_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "grievances_all_admin" ON public.grievances;
CREATE POLICY "grievances_all_admin" ON public.grievances
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- ================================================================
-- TABLE: training_courses
-- ================================================================
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "training_courses_select" ON public.training_courses;
CREATE POLICY "training_courses_select" ON public.training_courses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "training_courses_all_admin" ON public.training_courses;
CREATE POLICY "training_courses_all_admin" ON public.training_courses
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));

-- ================================================================
-- TABLE: training_enrollments
-- ================================================================
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;

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

-- ================================================================
-- TABLE: blog_articles
-- ================================================================
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_articles_select" ON public.blog_articles;
CREATE POLICY "blog_articles_select" ON public.blog_articles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "blog_articles_all_admin" ON public.blog_articles;
CREATE POLICY "blog_articles_all_admin" ON public.blog_articles
  FOR ALL USING (get_my_role() IN ('admin', 'super_admin'));
