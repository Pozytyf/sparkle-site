import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, MessageSquare, BarChart3, Eye, EyeOff, Trash2, Shield, Camera, Star, Package, Handshake, Check, X, Upload } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import AlbumForm from '@/components/realisations/AlbumForm';

type Tab = 'dashboard' | 'users' | 'content' | 'messages' | 'albums' | 'testimonials' | 'quotes' | 'shipments' | 'partners';

const AdminPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard' as Tab, label: t('admin.dashboard'), icon: BarChart3 },
    { id: 'users' as Tab, label: t('admin.users'), icon: Users },
    { id: 'messages' as Tab, label: t('admin.messages'), icon: MessageSquare },
    { id: 'testimonials' as Tab, label: t('admin.testimonials'), icon: Star },
    { id: 'quotes' as Tab, label: t('admin.quotes'), icon: FileText },
    { id: 'shipments' as Tab, label: t('admin.shipments'), icon: Package },
    { id: 'albums' as Tab, label: t('admin.albums'), icon: Camera },
    { id: 'partners' as Tab, label: t('admin.partners'), icon: Handshake },
    { id: 'content' as Tab, label: t('admin.content'), icon: FileText },
  ];

  return (
    <Layout>
      <section className="relative pt-32 pb-10 bg-primary overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-accent/90 text-accent-foreground text-sm font-semibold rounded-full mb-4">
              <Shield className="inline h-4 w-4 mr-1" /> {t('admin.badge')}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">{t('admin.title')}</h1>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
            {tabs.map((tab) => (
              <Button key={tab.id} variant={activeTab === tab.id ? 'accent' : 'ghost'} size="sm" onClick={() => setActiveTab(tab.id)} className="gap-2">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>

          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'albums' && <AlbumsTab />}
          {activeTab === 'testimonials' && <TestimonialsTab />}
          {activeTab === 'quotes' && <QuotesTab />}
          {activeTab === 'shipments' && <ShipmentsTab />}
          {activeTab === 'partners' && <PartnersTab />}
        </div>
      </section>
    </Layout>
  );
};

// === DASHBOARD ===
const DashboardTab = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ users: 0, messages: 0, unread: 0, testimonials: 0, quotes: 0, shipments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [profiles, messages, unread, testimonials, quotes, shipments] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('quote_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('shipments').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        users: profiles.count || 0,
        messages: messages.count || 0,
        unread: unread.count || 0,
        testimonials: testimonials.count || 0,
        quotes: quotes.count || 0,
        shipments: shipments.count || 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: t('admin.totalUsers'), value: stats.users, icon: Users, color: 'bg-primary/10 text-primary' },
    { label: t('admin.unreadMessages'), value: stats.unread, icon: MessageSquare, color: 'bg-destructive/10 text-destructive' },
    { label: t('admin.pendingTestimonials'), value: stats.testimonials, icon: Star, color: 'bg-accent/10 text-accent' },
    { label: t('admin.pendingQuotes'), value: stats.quotes, icon: FileText, color: 'bg-primary/10 text-primary' },
    { label: t('admin.totalShipments'), value: stats.shipments, icon: Package, color: 'bg-secondary text-secondary-foreground' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((stat) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border shadow-sm">
          {loading ? <Skeleton className="h-20" /> : (
            <>
              <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}><stat.icon className="h-5 w-5" /></div>
              <div className="font-heading text-3xl font-bold text-card-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// === USERS ===
const UsersTab = () => {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => { setProfiles(data || []); setLoading(false); }); }, []);
  if (loading) return <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>;
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted"><tr><th className="text-left p-4 text-sm font-medium text-muted-foreground">{t('contact.name')}</th><th className="text-left p-4 text-sm font-medium text-muted-foreground">{t('admin.joinedAt')}</th></tr></thead>
          <tbody>{profiles.map((p) => (<tr key={p.id} className="border-t border-border hover:bg-muted/50 transition-colors"><td className="p-4 text-foreground">{p.display_name || '—'}</td><td className="p-4 text-muted-foreground text-sm">{new Date(p.created_at).toLocaleDateString()}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};

// === CONTENT ===
const ContentTab = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ section_key: '', title: '', content: '', image_url: '' });
  const fetchContents = async () => { const { data } = await supabase.from('site_content').select('*').order('section_key'); setContents(data || []); setLoading(false); };
  useEffect(() => { fetchContents(); }, []);
  const handleSave = async () => {
    if (editing) { await supabase.from('site_content').update({ title: form.title, content: form.content, image_url: form.image_url, updated_by: user?.id }).eq('id', editing); }
    else { await supabase.from('site_content').insert({ ...form, updated_by: user?.id }); }
    toast({ title: t('admin.saved') }); setEditing(null); setForm({ section_key: '', title: '', content: '', image_url: '' }); fetchContents();
  };
  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">{editing ? t('admin.editContent') : t('admin.addContent')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input placeholder="section_key" value={form.section_key} onChange={(e) => setForm({ ...form, section_key: e.target.value })} disabled={!!editing} />
          <Input placeholder={t('admin.contentTitle')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <Textarea placeholder={t('admin.contentBody')} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="mb-4" />
        <Input placeholder="URL image" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="mb-4" />
        <div className="flex gap-2">
          <Button variant="accent" onClick={handleSave}>{t('admin.save')}</Button>
          {editing && <Button variant="ghost" onClick={() => { setEditing(null); setForm({ section_key: '', title: '', content: '', image_url: '' }); }}>{t('admin.cancel')}</Button>}
        </div>
      </div>
      {contents.map((item) => (
        <div key={item.id} className="bg-card rounded-xl p-4 border border-border flex justify-between items-start">
          <div><span className="text-xs font-mono text-accent">{item.section_key}</span><h4 className="font-heading font-bold text-foreground">{item.title || '—'}</h4><p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p></div>
          <Button variant="ghost" size="sm" onClick={() => { setEditing(item.id); setForm({ section_key: item.section_key, title: item.title || '', content: item.content || '', image_url: item.image_url || '' }); }}>{t('admin.edit')}</Button>
        </div>
      ))}
    </div>
  );
};

// === MESSAGES ===
const MessagesTab = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchMessages = async () => { const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }); setMessages(data || []); setLoading(false); };
  useEffect(() => { fetchMessages(); }, []);
  const toggleRead = async (id: string, currentRead: boolean) => { await supabase.from('contact_messages').update({ is_read: !currentRead }).eq('id', id); fetchMessages(); };
  if (loading) return <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>;
  return (
    <div className="space-y-4">
      {messages.length === 0 ? <div className="text-center py-12 text-muted-foreground">{t('admin.noMessages')}</div> : messages.map((msg) => (
        <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`bg-card rounded-xl p-6 border ${msg.is_read ? 'border-border' : 'border-accent/50 bg-accent/5'}`}>
          <div className="flex justify-between items-start mb-3">
            <div><h4 className="font-heading font-bold text-foreground">{msg.name}</h4><p className="text-sm text-muted-foreground">{msg.email} {msg.phone && `· ${msg.phone}`}</p></div>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</span>
              <Button variant="ghost" size="icon" onClick={() => toggleRead(msg.id, msg.is_read)}>{msg.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
            </div>
          </div>
          {msg.subject && <p className="text-sm font-medium text-foreground mb-2">{msg.subject}</p>}
          <p className="text-muted-foreground text-sm">{msg.message}</p>
        </motion.div>
      ))}
    </div>
  );
};

// === ALBUMS ===
const AlbumsTab = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAlbum, setEditingAlbum] = useState<any | null>(null);
  const fetchAlbums = async () => { const { data } = await supabase.from('albums').select('*').order('created_at', { ascending: false }); setAlbums(data || []); setLoading(false); };
  useEffect(() => { fetchAlbums(); }, []);
  const deleteAlbum = async (id: string) => { await supabase.from('album_photos').delete().eq('album_id', id); await supabase.from('albums').delete().eq('id', id); toast({ title: 'Album supprimé' }); fetchAlbums(); };
  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;
  return (
    <div className="space-y-6">
      <AlbumForm onSuccess={fetchAlbums} editAlbum={editingAlbum} onCancelEdit={() => setEditingAlbum(null)} />
      <h3 className="font-heading text-lg font-bold text-foreground">Albums existants ({albums.length})</h3>
      {albums.map((album) => (
        <motion.div key={album.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-4 border border-border flex gap-4 items-center">
          {album.cover_image_url ? <img src={album.cover_image_url} alt={album.title} className="h-16 w-16 rounded-lg object-cover flex-shrink-0" /> : <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0"><Camera className="h-6 w-6 text-muted-foreground" /></div>}
          <div className="flex-1 min-w-0"><h4 className="font-heading font-bold text-foreground truncate">{album.title}</h4><p className="text-sm text-muted-foreground">{album.category} · {new Date(album.created_at).toLocaleDateString()}</p></div>
          <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setEditingAlbum(album)}>{t('admin.edit')}</Button><Button variant="destructive" size="sm" onClick={() => deleteAlbum(album.id)}><Trash2 className="h-4 w-4" /></Button></div>
        </motion.div>
      ))}
    </div>
  );
};

// === TESTIMONIALS ===
const TestimonialsTab = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchItems = async () => { const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false }); setItems(data || []); setLoading(false); };
  useEffect(() => { fetchItems(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('testimonials').update({ status }).eq('id', id);
    toast({ title: status === 'approved' ? t('admin.approved') : t('admin.rejected') });
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id);
    fetchItems();
  };

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = { pending: 'bg-muted text-muted-foreground', approved: 'bg-accent/10 text-accent', rejected: 'bg-destructive/10 text-destructive' };
    return <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[s] || ''}`}>{s}</span>;
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? <div className="text-center py-12 text-muted-foreground">{t('admin.noTestimonials')}</div> : items.map(item => (
        <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1"><h4 className="font-heading font-bold text-foreground">{item.name}</h4>{statusBadge(item.status)}</div>
              <p className="text-sm text-muted-foreground">{item.company} · {item.role}</p>
            </div>
            <div className="flex gap-1">
              {item.status !== 'approved' && <Button variant="ghost" size="icon" onClick={() => updateStatus(item.id, 'approved')} title="Approuver"><Check className="h-4 w-4 text-accent" /></Button>}
              {item.status !== 'rejected' && <Button variant="ghost" size="icon" onClick={() => updateStatus(item.id, 'rejected')} title="Rejeter"><X className="h-4 w-4 text-destructive" /></Button>}
              <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="flex gap-1 mb-2">{Array.from({ length: item.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}</div>
          <p className="text-muted-foreground text-sm italic">"{item.content}"</p>
        </motion.div>
      ))}
    </div>
  );
};

// === QUOTES ===
const QuotesTab = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const fetchItems = async () => { const { data } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false }); setItems(data || []); setLoading(false); };
  useEffect(() => { fetchItems(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('quote_requests').update({ status }).eq('id', id);
    toast({ title: t('admin.saved') });
    fetchItems();
  };

  const saveNotes = async (id: string) => {
    await supabase.from('quote_requests').update({ admin_notes: notes }).eq('id', id);
    toast({ title: t('admin.saved') });
    setEditingNotes(null);
    fetchItems();
  };

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  const statusColors: Record<string, string> = { pending: 'bg-muted text-muted-foreground', processing: 'bg-primary/10 text-primary', completed: 'bg-accent/10 text-accent', rejected: 'bg-destructive/10 text-destructive' };

  return (
    <div className="space-y-4">
      {items.length === 0 ? <div className="text-center py-12 text-muted-foreground">{t('admin.noQuotes')}</div> : items.map(item => (
        <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
          <div className="flex flex-col md:flex-row md:items-start gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-heading font-bold text-foreground">{item.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[item.status] || ''}`}>{item.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.email} {item.phone && `· ${item.phone}`}</p>
            </div>
            <div className="flex gap-1 flex-wrap">
              {['pending', 'processing', 'completed', 'rejected'].map(s => (
                <Button key={s} variant={item.status === s ? 'accent' : 'ghost'} size="sm" onClick={() => updateStatus(item.id, s)} className="text-xs">{s}</Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
            <div><span className="text-muted-foreground">Marchandise:</span> <span className="text-foreground font-medium">{item.goods_type}</span></div>
            <div><span className="text-muted-foreground">Poids:</span> <span className="text-foreground font-medium">{item.weight || '—'}</span></div>
            <div><span className="text-muted-foreground">Origine:</span> <span className="text-foreground font-medium">{item.origin}</span></div>
            <div><span className="text-muted-foreground">Destination:</span> <span className="text-foreground font-medium">{item.destination}</span></div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Mode: <span className="font-medium text-foreground">{item.transport_mode}</span> · {new Date(item.created_at).toLocaleString()}</p>
          {item.details && <p className="text-sm text-muted-foreground italic mb-3">{item.details}</p>}

          {editingNotes === item.id ? (
            <div className="flex gap-2 mt-2">
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="flex-1" placeholder="Notes admin..." />
              <Button variant="accent" size="sm" onClick={() => saveNotes(item.id)}>{t('admin.save')}</Button>
              <Button variant="ghost" size="sm" onClick={() => setEditingNotes(null)}>{t('admin.cancel')}</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              {item.admin_notes && <p className="text-xs text-accent italic flex-1">📝 {item.admin_notes}</p>}
              <Button variant="ghost" size="sm" onClick={() => { setEditingNotes(item.id); setNotes(item.admin_notes || ''); }}>Notes</Button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// === SHIPMENTS ===
const ShipmentsTab = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ user_id: '', reference: '', description: '', origin: '', destination: '', weight: '', transport_mode: 'maritime', status: 'pending', estimated_delivery: '' });
  const [profiles, setProfiles] = useState<any[]>([]);

  const fetchItems = async () => { const { data } = await supabase.from('shipments').select('*').order('created_at', { ascending: false }); setItems(data || []); setLoading(false); };
  useEffect(() => { fetchItems(); supabase.from('profiles').select('user_id, display_name').then(({ data }) => setProfiles(data || [])); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('shipments').insert({
      ...form,
      estimated_delivery: form.estimated_delivery || null,
      weight: form.weight || null,
      description: form.description || null,
    });
    if (!error) { toast({ title: t('admin.saved') }); setShowForm(false); setForm({ user_id: '', reference: '', description: '', origin: '', destination: '', weight: '', transport_mode: 'maritime', status: 'pending', estimated_delivery: '' }); fetchItems(); }
    else { toast({ title: t('auth.error'), description: error.message, variant: 'destructive' }); }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('shipments').update({ status }).eq('id', id);
    // Add event
    await supabase.from('shipment_events').insert({ shipment_id: id, status, description: `Statut mis à jour: ${status}` });
    toast({ title: t('admin.saved') });
    fetchItems();
  };

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  const statusColors: Record<string, string> = { pending: 'bg-muted text-muted-foreground', picked_up: 'bg-accent/10 text-accent', in_transit: 'bg-primary/10 text-primary', customs: 'bg-destructive/10 text-destructive', delivered: 'bg-accent/20 text-accent', cancelled: 'bg-destructive/10 text-destructive' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-heading text-lg font-bold text-foreground">{t('admin.shipments')} ({items.length})</h3>
        <Button variant="accent" size="sm" onClick={() => setShowForm(!showForm)}>{showForm ? t('admin.cancel') : t('admin.addShipment')}</Button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleCreate} className="bg-card rounded-xl p-6 border border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })} required>
              <option value="">Client...</option>
              {profiles.map(p => <option key={p.user_id} value={p.user_id}>{p.display_name}</option>)}
            </select>
            <Input placeholder="Référence (ex: HP-2026-001)" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Origine" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} required />
            <Input placeholder="Destination" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required />
            <Input placeholder="Poids" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.transport_mode} onChange={e => setForm({ ...form, transport_mode: e.target.value })}>
              <option value="maritime">Maritime</option><option value="aerien">Aérien</option><option value="routier">Routier</option><option value="ferroviaire">Ferroviaire</option>
            </select>
            <Input type="date" placeholder="Livraison estimée" value={form.estimated_delivery} onChange={e => setForm({ ...form, estimated_delivery: e.target.value })} />
          </div>
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
          <Button type="submit" variant="accent">{t('admin.save')}</Button>
        </motion.form>
      )}

      {items.map(s => (
        <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-4 border border-border">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h4 className="font-heading font-bold text-foreground">{s.reference}</h4>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[s.status] || ''}`}>{s.status}</span>
            <span className="text-xs text-muted-foreground ml-auto">{new Date(s.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{s.origin} → {s.destination} · {s.transport_mode} {s.weight && `· ${s.weight}`}</p>
          <div className="flex gap-1 flex-wrap">
            {['pending', 'picked_up', 'in_transit', 'customs', 'delivered', 'cancelled'].map(st => (
              <Button key={st} variant={s.status === st ? 'accent' : 'ghost'} size="sm" onClick={() => updateStatus(s.id, st)} className="text-xs">{st}</Button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// === PARTNERS ===
const PartnersTab = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', logo_url: '', website: '', sort_order: 0 });
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => { const { data } = await supabase.from('partners').select('*').order('sort_order'); setItems(data || []); setLoading(false); };
  useEffect(() => { fetchItems(); }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `partners/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('album-images').upload(path, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('album-images').getPublicUrl(path);
      setForm(f => ({ ...f, logo_url: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await supabase.from('partners').insert({ name: form.name.trim(), logo_url: form.logo_url || null, website: form.website || null, sort_order: form.sort_order });
    toast({ title: t('admin.saved') });
    setForm({ name: '', logo_url: '', website: '', sort_order: 0 });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('partners').delete().eq('id', id);
    fetchItems();
  };

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="font-heading text-lg font-bold text-foreground">{t('admin.addPartner')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Nom du partenaire" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Site web (optionnel)" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
          <Input type="number" placeholder="Ordre" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors">
              <Upload className="h-4 w-4" /> {uploading ? 'Upload...' : 'Logo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
            {form.logo_url && <img src={form.logo_url} alt="preview" className="h-8 w-auto rounded" />}
          </div>
          <Input placeholder="ou URL du logo" value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} className="flex-1" />
        </div>
        <Button variant="accent" onClick={handleAdd}>{t('admin.save')}</Button>
      </div>

      <h3 className="font-heading text-lg font-bold text-foreground">Partenaires ({items.length})</h3>
      {items.map(item => (
        <div key={item.id} className="bg-card rounded-xl p-4 border border-border flex items-center gap-4">
          {item.logo_url ? <img src={item.logo_url} alt={item.name} className="h-10 w-auto max-w-[80px] object-contain" /> : <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">{item.name[0]}</div>}
          <div className="flex-1"><h4 className="font-heading font-bold text-foreground">{item.name}</h4>{item.website && <p className="text-xs text-muted-foreground">{item.website}</p>}</div>
          <span className="text-xs text-muted-foreground">#{item.sort_order}</span>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
