import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ContentMap = Record<string, string>;

let cache: ContentMap | null = null;
let pending: Promise<ContentMap> | null = null;
const listeners = new Set<(m: ContentMap) => void>();

const fetchAll = async (): Promise<ContentMap> => {
  if (cache) return cache;
  if (pending) return pending;
  pending = (async () => {
    const { data } = await supabase.from('site_content').select('section_key, content');
    const map: ContentMap = {};
    (data || []).forEach((r: any) => { if (r.content) map[r.section_key] = r.content; });
    cache = map;
    pending = null;
    listeners.forEach(l => l(map));
    return map;
  })();
  return pending;
};

// Realtime: refetch on any change
let subscribed = false;
const ensureSubscribed = () => {
  if (subscribed) return;
  subscribed = true;
  supabase
    .channel('site-content-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, () => {
      cache = null;
      fetchAll();
    })
    .subscribe();
};

/**
 * Returns a getter `c(key, fallback)` that reads CMS content with fallback.
 * Auto-refreshes when admin edits content (via realtime).
 */
export const useSiteContent = () => {
  const [map, setMap] = useState<ContentMap>(cache || {});

  useEffect(() => {
    ensureSubscribed();
    const listener = (m: ContentMap) => setMap({ ...m });
    listeners.add(listener);
    fetchAll().then(m => setMap({ ...m }));
    return () => { listeners.delete(listener); };
  }, []);

  const c = (key: string, fallback: string = ''): string => map[key] || fallback;
  return { c, content: map };
};
