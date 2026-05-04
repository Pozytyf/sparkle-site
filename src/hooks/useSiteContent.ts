import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ContentMap = Record<string, string>;

// Two views of content: published (live) and draft (admin preview)
let publishedCache: ContentMap | null = null;
let draftCache: ContentMap | null = null;
let pending: Promise<void> | null = null;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

// Admin preview toggle (in-memory + localStorage persistence)
const PREVIEW_KEY = 'cms_preview_drafts';
let previewDrafts = typeof window !== 'undefined' && localStorage.getItem(PREVIEW_KEY) === '1';

export const isPreviewingDrafts = () => previewDrafts;
export const setPreviewDrafts = (v: boolean) => {
  previewDrafts = v;
  if (typeof window !== 'undefined') localStorage.setItem(PREVIEW_KEY, v ? '1' : '0');
  notify();
};

const fetchAll = async (force = false): Promise<void> => {
  if (publishedCache && !force) return;
  if (pending) return pending;
  pending = (async () => {
    const { data } = await supabase
      .from('site_content')
      .select('section_key, content, draft_content, has_draft');
    const pub: ContentMap = {};
    const drf: ContentMap = {};
    (data || []).forEach((r: any) => {
      if (r.content !== null && r.content !== undefined) pub[r.section_key] = r.content;
      // Draft view = published value overlaid with draft when present
      drf[r.section_key] = r.has_draft && r.draft_content !== null ? r.draft_content : r.content;
    });
    publishedCache = pub;
    draftCache = drf;
    pending = null;
    notify();
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
 * Save a content key. By default writes to draft_content (mode brouillon global).
 * Pass { publish: true } to write directly to live content (used by admin "Publier").
 */
export const setSiteContent = async (
  key: string,
  value: string,
  label?: string,
  options: { publish?: boolean } = {}
) => {
  const publish = options.publish ?? false;

  // Optimistic update
  if (publish) {
    publishedCache = { ...(publishedCache || {}), [key]: value };
  }
  draftCache = { ...(draftCache || {}), [key]: value };
  notify();

  const { data: existing } = await supabase
    .from('site_content')
    .select('id')
    .eq('section_key', key)
    .maybeSingle();

  const { data: { user } } = await supabase.auth.getUser();

  if (existing) {
    if (publish) {
      await supabase.from('site_content').update({
        content: value,
        draft_content: null,
        has_draft: false,
        draft_updated_at: null,
        draft_updated_by: null,
        updated_by: user?.id,
      }).eq('id', existing.id);
    } else {
      await supabase.from('site_content').update({
        draft_content: value,
        has_draft: true,
        draft_updated_at: new Date().toISOString(),
        draft_updated_by: user?.id,
      }).eq('id', existing.id);
    }
  } else {
    // First-time create: write to both content and (no draft)
    await supabase.from('site_content').insert({
      section_key: key,
      content: publish ? value : '',
      draft_content: publish ? null : value,
      has_draft: !publish,
      draft_updated_at: publish ? null : new Date().toISOString(),
      draft_updated_by: publish ? null : user?.id,
      title: label || key,
    });
  }
  return value;
};

/** Publish all pending drafts (admin only) */
export const publishAllDrafts = async (): Promise<number> => {
  const { data, error } = await supabase.rpc('publish_all_drafts');
  if (error) throw error;
  await fetchAll(true);
  return (data as number) || 0;
};

/** Discard all pending drafts (admin only) */
export const discardAllDrafts = async (): Promise<number> => {
  const { data, error } = await supabase.rpc('discard_all_drafts');
  if (error) throw error;
  await fetchAll(true);
  return (data as number) || 0;
};

/** Count pending drafts (admin badge) */
export const useDraftCount = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { count: c } = await supabase
        .from('site_content')
        .select('*', { count: 'exact', head: true })
        .eq('has_draft', true);
      if (alive) setCount(c || 0);
    };
    load();
    const channel = supabase
      .channel('draft-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, load)
      .subscribe();
    return () => { alive = false; supabase.removeChannel(channel); };
  }, []);
  return count;
};

export const useSiteContent = () => {
  const [, force] = useState(0);

  useEffect(() => {
    ensureSubscribed();
    const listener = () => force(n => n + 1);
    listeners.add(listener);
    fetchAll().then(listener);
    return () => { listeners.delete(listener); };
  }, []);

  // If previewing drafts, return draft view; otherwise published view.
  const map = previewDrafts ? (draftCache || {}) : (publishedCache || {});

  const c = (key: string, fallback: string = ''): string => {
    const v = map[key];
    return v && v.length > 0 ? v : fallback;
  };
  return { c, content: map, set: setSiteContent, isPreviewingDrafts: previewDrafts };
};
