import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HeroSlide {
  id: string;
  image_url: string;
  title: string | null;
}

export const useHeroSlides = () =>
  useQuery({
    queryKey: ['hero_slides'],
    staleTime: 5 * 60 * 1000, // 5 min cache
    gcTime: 30 * 60 * 1000,
    queryFn: async (): Promise<HeroSlide[]> => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('id,image_url,title')
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });
