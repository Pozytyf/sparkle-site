-- Add draft columns to site_content
ALTER TABLE public.site_content
  ADD COLUMN IF NOT EXISTS draft_content TEXT,
  ADD COLUMN IF NOT EXISTS has_draft BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS draft_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS draft_updated_by UUID;

CREATE INDEX IF NOT EXISTS idx_site_content_has_draft ON public.site_content(has_draft) WHERE has_draft = TRUE;

-- Publish all drafts (admin only)
CREATE OR REPLACE FUNCTION public.publish_all_drafts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected INTEGER;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can publish drafts';
  END IF;

  WITH updated AS (
    UPDATE public.site_content
    SET content = draft_content,
        draft_content = NULL,
        has_draft = FALSE,
        draft_updated_at = NULL,
        draft_updated_by = NULL,
        updated_by = auth.uid()
    WHERE has_draft = TRUE AND draft_content IS NOT NULL
    RETURNING 1
  )
  SELECT COUNT(*) INTO affected FROM updated;

  RETURN affected;
END;
$$;

-- Discard all drafts (admin only)
CREATE OR REPLACE FUNCTION public.discard_all_drafts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected INTEGER;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can discard drafts';
  END IF;

  WITH updated AS (
    UPDATE public.site_content
    SET draft_content = NULL,
        has_draft = FALSE,
        draft_updated_at = NULL,
        draft_updated_by = NULL
    WHERE has_draft = TRUE
    RETURNING 1
  )
  SELECT COUNT(*) INTO affected FROM updated;

  RETURN affected;
END;
$$;

GRANT EXECUTE ON FUNCTION public.publish_all_drafts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.discard_all_drafts() TO authenticated;