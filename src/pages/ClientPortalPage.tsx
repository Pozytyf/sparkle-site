import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, Ship, Plane, Truck, Train, Search, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  picked_up: 'bg-accent/10 text-accent',
  in_transit: 'bg-primary/10 text-primary',
  customs: 'bg-destructive/10 text-destructive',
  delivered: 'bg-accent/20 text-accent',
  cancelled: 'bg-destructive/10 text-destructive',
};

const modeIcons: Record<string, any> = { maritime: Ship, aerien: Plane, routier: Truck, ferroviaire: Train };

const ClientPortalPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [shipments, setShipments] = useState<any[]>([]);
  const [events, setEvents] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [shipRes, quoteRes] = await Promise.all([
        supabase.from('shipments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('quote_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      setShipments(shipRes.data || []);
      setQuotes(quoteRes.data || []);
      setLoading(false);
    };
    fetchData();

    // Realtime subscription
    const channel = supabase.channel('my-shipments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments', filter: `user_id=eq.${user.id}` }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const toggleExpand = async (shipmentId: string) => {
    if (expanded === shipmentId) { setExpanded(null); return; }
    setExpanded(shipmentId);
    if (!events[shipmentId]) {
      const { data } = await supabase.from('shipment_events').select('*').eq('shipment_id', shipmentId).order('created_at', { ascending: false });
      setEvents(prev => ({ ...prev, [shipmentId]: data || [] }));
    }
  };

  const filtered = shipments.filter(s =>
    s.reference.toLowerCase().includes(search.toLowerCase()) ||
    s.origin.toLowerCase().includes(search.toLowerCase()) ||
    s.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <Seo titleKey="seo.portal.title" descKey="seo.portal.desc" path="/espace-client" />
      <section className="relative pt-32 pb-10 bg-primary overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-accent/90 text-accent-foreground text-sm font-semibold rounded-full mb-4">
              <Package className="inline h-4 w-4 mr-1" /> {t('portal.badge')}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">{t('portal.title')}</h1>
            <p className="text-primary-foreground/80 mt-3">{t('portal.description')}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('portal.search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>

          {/* Shipments */}
          <h2 className="font-heading text-xl font-bold text-foreground mb-6">{t('portal.shipments')} ({filtered.length})</h2>

          {loading ? (
            <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">{t('portal.noShipments')}</div>
          ) : (
            <div className="space-y-4">
              {filtered.map(s => {
                const ModeIcon = modeIcons[s.transport_mode] || Package;
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer" onClick={() => toggleExpand(s.id)}>
                      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <ModeIcon className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-heading font-bold text-foreground">{s.reference}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[s.status] || ''}`}>
                            {t(`portal.status.${s.status}`)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {s.origin} → {s.destination}
                          {s.estimated_delivery && <span className="ml-2"><Clock className="inline h-3 w-3" /> {new Date(s.estimated_delivery).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      {expanded === s.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </div>

                    {expanded === s.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-border bg-muted/30 p-6">
                        {s.description && <p className="text-sm text-muted-foreground mb-4">{s.description}</p>}
                        <h4 className="font-heading font-bold text-foreground text-sm mb-3">{t('portal.history')}</h4>
                        {(events[s.id] || []).length === 0 ? (
                          <p className="text-sm text-muted-foreground">{t('portal.noEvents')}</p>
                        ) : (
                          <div className="space-y-3">
                            {(events[s.id] || []).map((ev, i) => (
                              <div key={ev.id} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className={`h-3 w-3 rounded-full ${i === 0 ? 'bg-accent' : 'bg-border'}`} />
                                  {i < (events[s.id]?.length || 0) - 1 && <div className="w-px h-full bg-border" />}
                                </div>
                                <div className="pb-3">
                                  <p className="text-sm font-medium text-foreground">{ev.description || ev.status}</p>
                                  <p className="text-xs text-muted-foreground">{ev.location && `${ev.location} · `}{new Date(ev.created_at).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Quote requests */}
          {quotes.length > 0 && (
            <>
              <h2 className="font-heading text-xl font-bold text-foreground mt-12 mb-6">{t('portal.myQuotes')} ({quotes.length})</h2>
              <div className="space-y-3">
                {quotes.map(q => (
                  <div key={q.id} className="bg-card rounded-xl p-4 border border-border flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{q.goods_type} — {q.origin} → {q.destination}</p>
                      <p className="text-sm text-muted-foreground">{q.transport_mode} · {new Date(q.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[q.status] || 'bg-muted text-muted-foreground'}`}>
                      {t(`quote.status.${q.status}`)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ClientPortalPage;
