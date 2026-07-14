-- ============================================================
-- Migration: Secure Deployments RLS & Escrow Balance Updates
-- ============================================================

-- 1. Drop existing update policy
DROP POLICY IF EXISTS "deployments_update" ON public.deployments;

-- 2. Create new update policy
CREATE POLICY "deployments_update_fields" ON public.deployments
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

-- 3. Create or replace the trigger function to enforce escrow_balance immutability
CREATE OR REPLACE FUNCTION public.enforce_deployment_escrow_balance_protection()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.escrow_balance IS DISTINCT FROM OLD.escrow_balance THEN
    -- Only allow update if the local transaction parameter 'app.allow_escrow_update' is 'true'
    IF COALESCE(current_setting('app.allow_escrow_update', true), 'false') <> 'true' THEN
      RAISE EXCEPTION 'Updates to escrow_balance are not allowed directly. Use release_escrow() instead.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the BEFORE UPDATE trigger
DROP TRIGGER IF EXISTS check_deployment_escrow_balance_update ON public.deployments;
CREATE TRIGGER check_deployment_escrow_balance_update
  BEFORE UPDATE ON public.deployments
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_deployment_escrow_balance_protection();

-- 5. Redefine release_escrow function as PL/pgSQL to set transaction-local config
CREATE OR REPLACE FUNCTION public.release_escrow(
  p_deployment_id uuid,
  p_amount        numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set transaction-local setting to allow escrow_balance update in this transaction
  PERFORM set_config('app.allow_escrow_update', 'true', true);

  UPDATE public.deployments
  SET    escrow_balance = GREATEST(0, COALESCE(escrow_balance, 0) - p_amount)
  WHERE  id = p_deployment_id;
END;
$$;
