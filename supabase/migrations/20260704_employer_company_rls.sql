-- ============================================================
-- Fix: missing INSERT policies for employers on companies +
-- company_members tables.
--
-- The prior migration defined SELECT / UPDATE / admin-ALL
-- policies but omitted INSERT for the employer role, causing
-- the company setup form to fail with an RLS violation.
-- ============================================================

-- Allow any employer (or admin) to create a new company row.
-- The employer has no company_id yet at this point, so we
-- cannot check get_my_company_id() — we just verify their role.
DROP POLICY IF EXISTS "companies_insert_employer" ON public.companies;
CREATE POLICY "companies_insert_employer" ON public.companies
  FOR INSERT WITH CHECK (
    get_my_role() IN ('employer', 'admin', 'super_admin')
  );

-- Allow an employer to insert a company_members row only for
-- themselves (user_id = auth.uid()), preventing them from
-- adding other users to a company.
DROP POLICY IF EXISTS "company_members_insert_employer" ON public.company_members;
CREATE POLICY "company_members_insert_employer" ON public.company_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND get_my_role() IN ('employer', 'admin', 'super_admin')
  );
