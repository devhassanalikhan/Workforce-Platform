-- ============================================================
-- Migration: Add company profile fields, update auth trigger,
-- and configure storage for company logos.
-- ============================================================

-- 1. Add missing columns to public.companies table
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS business_type TEXT,
  ADD COLUMN IF NOT EXISTS registration_number TEXT,
  ADD COLUMN IF NOT EXISTS registration_authority TEXT,
  ADD COLUMN IF NOT EXISTS company_address TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS company_website TEXT,
  ADD COLUMN IF NOT EXISTS contact_person TEXT,
  ADD COLUMN IF NOT EXISTS designation TEXT,
  ADD COLUMN IF NOT EXISTS phone_country_code TEXT,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'Free';

-- 2. Update public.handle_new_user() trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  company_id uuid;
  user_role text;
  full_name text;
  company_name text;
BEGIN
  user_role := COALESCE(new.raw_user_meta_data->>'role', 'applicant');
  full_name := COALESCE(new.raw_user_meta_data->>'full_name', 'User');
  company_name := new.raw_user_meta_data->>'company_name';

  IF user_role = 'applicant' THEN
    INSERT INTO public.talent_profiles (id, name, role_title, location, experience_years, skills, languages, certifications, available)
    VALUES (
      new.id,
      full_name,
      'Other',
      'Not specified',
      0,
      '{}',
      '{}',
      '{}',
      true
    )
    ON CONFLICT (id) DO NOTHING;
  ELSIF user_role = 'employer' AND company_name IS NOT NULL THEN
    -- Check if company already exists to prevent duplicate company creation
    SELECT id INTO company_id FROM public.companies WHERE name = company_name LIMIT 1;
    
    IF company_id IS NULL THEN
      INSERT INTO public.companies (
        name,
        business_type,
        registration_number,
        registration_authority,
        company_address,
        country,
        company_website,
        contact_person,
        designation,
        phone_country_code,
        phone_number,
        plan_tier
      )
      VALUES (
        company_name,
        new.raw_user_meta_data->>'business_type',
        new.raw_user_meta_data->>'registration_number',
        new.raw_user_meta_data->>'registration_authority',
        new.raw_user_meta_data->>'company_address',
        new.raw_user_meta_data->>'country',
        new.raw_user_meta_data->>'company_website',
        new.raw_user_meta_data->>'contact_person',
        new.raw_user_meta_data->>'designation',
        new.raw_user_meta_data->>'phone_country_code',
        new.raw_user_meta_data->>'phone_number',
        'Free'
      )
      RETURNING id INTO company_id;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM public.company_members WHERE user_id = new.id
    ) THEN
      INSERT INTO public.company_members (user_id, company_id)
      VALUES (new.id, company_id);
    END IF;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Configure storage bucket for company logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up security policies for company-logos bucket
DROP POLICY IF EXISTS "Allow public read access to company-logos" ON storage.objects;
CREATE POLICY "Allow public read access to company-logos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "Allow authenticated uploads to company-logos" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to company-logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'company-logos'
    AND name LIKE (auth.uid()::text || '/%')
  );

DROP POLICY IF EXISTS "Allow authenticated updates to company-logos" ON storage.objects;
CREATE POLICY "Allow authenticated updates to company-logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'company-logos'
    AND name LIKE (auth.uid()::text || '/%')
  );
