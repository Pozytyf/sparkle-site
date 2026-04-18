import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ContentMap = Record<string, string>;

let cache: ContentMap | null = null;
let pending: Promise<ContentMap> | null = null;
const listeners = new Set<(m: ContentMap) => void>();

const notify = (m: ContentMap) => listeners.forEach(l => l(m));

const fetchAll = async (force = false): Promise<ContentMap> => {
  if (cache && !force) return cache;
  if (pending) return pending;
  pending = (async () => {
    const { data } = await supabase.from('site_content').select('section_key, content');
    const map: ContentMap = {};
    (data || []).forEach((r: any) => { if (r.content !== null && r.content !== undefined) map[r.section_key] = r.content; });
    cache = map;
    pending = null;
    notify(map);
    return map;
  })();
  return pending;
};

let subscribed = false;
const ensureSubscribed = () => {
  if (subscribed) return;
  subscribed = true;
  supabase
    .channel('site-content-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, () => {
      fetchAll(true);
    })
    .subscribe();
};

/**
 * Save a content key (upsert). Returns the saved value. Optimistic update.
 */
export const setSiteContent = async (key: string, value: string, label?: string) => {
  // Optimistic
  cache = { ...(cache || {}), [key]: value };
  notify(cache);

  const { data: existing } = await supabase
    .from('site_content')
    .select('id')
    .eq('section_key', key)
    .maybeSingle();

  if (existing) {
    await supabase.from('site_content').update({ content: value }).eq('id', existing.id);
  } else {
    await supabase.from('site_content').insert({ section_key: key, content: value, title: label || key });
  }
  return value;
};

export const useSiteContent = () => {
  const [map, setMap] = useState<ContentMap>(cache || {});

  useEffect(() => {
    ensureSubscribed();
    const listener = (m: ContentMap) => setMap({ ...m });
    listeners.add(listener);
    fetchAll().then(m => setMap({ ...m }));
    return () => { listeners.delete(listener); };
  }, []);

  const c = (key: string, fallback: string = ''): string => {
    const v = map[key];
    return v && v.length > 0 ? v : fallback;
  };
  return { c, content: map, set: setSiteContent };
};
