
-- Create albums table
CREATE TABLE public.albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'chantier',
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Albums are viewable by everyone" ON public.albums FOR SELECT USING (true);
CREATE POLICY "Admins can insert albums" ON public.albums FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update albums" ON public.albums FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete albums" ON public.albums FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create album_photos table
CREATE TABLE public.album_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.album_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Album photos are viewable by everyone" ON public.album_photos FOR SELECT USING (true);
CREATE POLICY "Admins can insert album photos" ON public.album_photos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update album photos" ON public.album_photos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete album photos" ON public.album_photos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('album-images', 'album-images', true);

CREATE POLICY "Album images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'album-images');
CREATE POLICY "Admins can upload album images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'album-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete album images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'album-images' AND public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON public.albums FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
