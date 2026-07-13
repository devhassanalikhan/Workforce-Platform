-- ============================================================
-- Migration: Apply Now dialog profile fields
-- ============================================================
-- Adds the applicant demographic/professional fields collected by
-- the Apply Now form (JobApplicationForm.tsx), modelled after the
-- OES (Overseas Employment Services) registration form. These are
-- profile-level facts about the applicant (not job-specific), so
-- they live on talent_profiles and are filled in once, then reused
-- across every future application.
--
-- All columns are nullable at the DB level — required-ness for the
-- Apply Now form is enforced client-side so existing rows aren't
-- broken. Safe to run repeatedly (IF NOT EXISTS / guarded DO blocks).
-- ============================================================

ALTER TABLE public.talent_profiles
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS cnic TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS qualification TEXT,
  ADD COLUMN IF NOT EXISTS field_of_work TEXT,
  ADD COLUMN IF NOT EXISTS relevant_experience_years INT4,
  ADD COLUMN IF NOT EXISTS foreign_experience TEXT,
  ADD COLUMN IF NOT EXISTS driving_license TEXT,
  ADD COLUMN IF NOT EXISTS has_certification TEXT,
  ADD COLUMN IF NOT EXISTS height TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'talent_profiles_cnic_format'
  ) THEN
    ALTER TABLE public.talent_profiles
      ADD CONSTRAINT talent_profiles_cnic_format CHECK (cnic IS NULL OR cnic ~ '^\d{13}$');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'talent_profiles_cnic_unique'
  ) THEN
    ALTER TABLE public.talent_profiles
      ADD CONSTRAINT talent_profiles_cnic_unique UNIQUE (cnic);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'talent_profiles_gender_check'
  ) THEN
    ALTER TABLE public.talent_profiles
      ADD CONSTRAINT talent_profiles_gender_check CHECK (gender IS NULL OR gender IN ('Male','Female'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'talent_profiles_foreign_exp_check'
  ) THEN
    ALTER TABLE public.talent_profiles
      ADD CONSTRAINT talent_profiles_foreign_exp_check CHECK (foreign_experience IS NULL OR foreign_experience IN ('Yes','No'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'talent_profiles_driving_license_check'
  ) THEN
    ALTER TABLE public.talent_profiles
      ADD CONSTRAINT talent_profiles_driving_license_check CHECK (driving_license IS NULL OR driving_license IN ('Yes','No'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'talent_profiles_certification_check'
  ) THEN
    ALTER TABLE public.talent_profiles
      ADD CONSTRAINT talent_profiles_certification_check CHECK (has_certification IS NULL OR has_certification IN ('Yes','No'));
  END IF;
END $$;

COMMENT ON COLUMN public.talent_profiles.cnic IS 'Pakistani CNIC, 13 digits, no dashes.';
COMMENT ON COLUMN public.talent_profiles.has_certification IS 'Yes/No gate from the Apply Now form — distinct from the certifications[] name list already on this table.';
