-- ============================================================
-- Atomic escrow release RPC
-- Runs in a single UPDATE statement to avoid read-modify-write
-- race conditions under concurrent calls.
-- ============================================================

CREATE OR REPLACE FUNCTION public.release_escrow(
  p_deployment_id uuid,
  p_amount        numeric
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.deployments
  SET    escrow_balance = GREATEST(0, COALESCE(escrow_balance, 0) - p_amount)
  WHERE  id = p_deployment_id;
$$;
