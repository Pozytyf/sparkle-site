-- History table for site_content changes
CREATE TABLE public.site_content_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  title TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  action TEXT NOT NULL DEFAULT 'update'
);

CREATE INDEX idx_site_content_history_key ON public.site_content_history(section_key, changed_at DESC);

ALTER TABLE public.site_content_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view history"
ON public.site_content_history FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert history"
ON public.site_content_history FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to log every change to site_content
CREATE OR REPLACE FUNCTION public.log_site_content_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.site_content_history (section_key, content, image_url, title, metadata, changed_by, action)
    VALUES (OLD.section_key, OLD.content, OLD.image_url, OLD.title, OLD.metadata, OLD.updated_by, 'update');
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.site_content_history (section_key, content, image_url, title, metadata, changed_by, action)
    VALUES (OLD.section_key, OLD.content, OLD.image_url, OLD.title, OLD.metadata, OLD.updated_by, 'delete');
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_log_site_content_change
BEFORE UPDATE OR DELETE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.log_site_content_change();

-- Auto-update updated_at on site_content
DROP TRIGGER IF EXISTS trg_site_content_updated_at ON public.site_content;
CREATE TRIGGER trg_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();