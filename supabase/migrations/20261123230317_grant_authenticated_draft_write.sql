-- The owner-only INSERT and UPDATE RLS policies already exist.
-- These table privileges let authenticated users reach those policies;
-- RLS continues to restrict every write to the user's own draft rows.
GRANT INSERT, UPDATE ON TABLE public.drafts TO authenticated;
