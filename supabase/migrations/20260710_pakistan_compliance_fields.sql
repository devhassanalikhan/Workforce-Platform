-- ============================================================
-- Migration: Pakistani overseas employment compliance fields
-- ============================================================
-- Adds the GAMCA-network medical approval flag to the
-- compliance_checklist_items table.  The three new item_key
-- values (emigration_clearance, police_clearance, welfare_fund)
-- are free-text and require no DDL — they are created at
-- application / insert time, same as the existing 8 keys.
-- Safe to run repeatedly (IF NOT EXISTS).
-- ============================================================

ALTER TABLE public.compliance_checklist_items
  ADD COLUMN IF NOT EXISTS gamca_approved BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.compliance_checklist_items.gamca_approved IS
  'GAMCA-network medical approval status. Only meaningful when item_key = ''medical''.';
