import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History, RotateCcw, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface HistoryEntry {
  id: string;
  section_key: string;
  content: string | null;
  image_url: string | null;
  title: string | null;
  changed_by: string | null;
  changed_at: string;
  action: string;
}

const SiteContentHistory = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [restoring, setRestoring] = useState<string | null>(null);
  const [preview, setPreview] = useState<HistoryEntry | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('site_content_history')
      .select('*')
      .order('changed_at', { ascending: false })
      .limit(200);
    setEntries((data || []) as HistoryEntry[]);
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, []);

  const restore = async (entry: HistoryEntry) => {
    setRestoring(entry.id);
    const { data: existing } = await supabase
      .from('site_content')
      .select('id')
      .eq('section_key', entry.section_key)
      .maybeSingle();
    const payload = {
      content: entry.content,
      image_url: entry.image_url,
      title: entry.title,
      updated_by: user?.id,
    };
    if (existing) {
      await supabase.from('site_content').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('site_content').insert({ section_key: entry.section_key, ...payload });
    }
    toast({ title: '✅ Version restaurée', description: entry.section_key });
    setRestoring(null);
    setPreview(null);
    fetchHistory();
  };

  const filtered = search
    ? entries.filter(e => e.section_key.toLowerCase().includes(search.toLowerCase()) || (e.content || '').toLowerCase().includes(search.toLowerCase()))
    : entries;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-accent" />
          <h3 className="font-heading text-lg font-bold text-foreground">Historique des modifications</h3>
          <span className="text-xs text-muted-foreground">({entries.length})</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64 text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
          Aucune modification enregistrée.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(entry => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg p-4 border border-border flex items-start justify-between gap-4 hover:border-accent/40 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">{entry.section_key}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${entry.action === 'delete' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                    {entry.action}
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(entry.changed_at).toLocaleString('fr-FR')}</span>
                </div>
                <p className="text-sm text-foreground line-clamp-2">
                  {entry.content || (entry.image_url ? `🖼️ ${entry.image_url}` : '—')}
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => setPreview(entry)} className="h-8 text-xs">
                  Voir
                </Button>
                <Button variant="accent" size="sm" onClick={() => restore(entry)} disabled={restoring === entry.id} className="h-8 text-xs gap-1">
                  {restoring === entry.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                  Restaurer
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-card max-w-2xl w-full rounded-xl border border-border p-6 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">{preview.section_key}</span>
                <p className="text-xs text-muted-foreground mt-1">{new Date(preview.changed_at).toLocaleString('fr-FR')}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPreview(null)}><X className="h-4 w-4" /></Button>
            </div>
            {preview.image_url && <img src={preview.image_url} alt="" className="w-full max-h-64 object-contain rounded-lg mb-4 border border-border" />}
            <div className="text-sm text-foreground whitespace-pre-wrap break-words">{preview.content || '—'}</div>
            <div className="flex justify-end mt-6">
              <Button variant="accent" onClick={() => restore(preview)} disabled={restoring === preview.id} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Restaurer cette version
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteContentHistory;
