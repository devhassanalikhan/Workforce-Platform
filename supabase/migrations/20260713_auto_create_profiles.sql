-- ============================================================
-- Trigger function to automatically create talent profiles
-- and company records when a user registers in auth.users
-- ============================================================

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
      INSERT INTO public.companies (name)
      VALUES (company_name)
      RETURNING id INTO company_id;
    END IF;

    INSERT INTO public.company_members (user_id, company_id)
    VALUES (new.id, company_id)
    ON CONFLICT (user_id, company_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
