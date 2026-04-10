import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, MessageSquare, BarChart3, Eye, EyeOff, Trash2, Shield, Camera } from 'lucide-react';
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

type Tab = 'dashboard' | 'users' | 'content' | 'messages' | 'albums';

const AdminPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard' as Tab, label: t('admin.dashboard'), icon: BarChart3 },
    { id: 'users' as Tab, label: t('admin.users'), icon: Users },
    { id: 'content' as Tab, label: t('admin.content'), icon: FileText },
    { id: 'messages' as Tab, label: t('admin.messages'), icon: MessageSquare },
    { id: 'albums' as Tab, label: t('admin.albums'), icon: Camera },
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
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'accent' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'albums' && <AlbumsTab />}
        </div>
      </section>
    </Layout>
  );
};

const DashboardTab = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ users: 0, messages: 0, unread: 0, content: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [profiles, messages, unread, content] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('site_content').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        users: profiles.count || 0,
        messages: messages.count || 0,
        unread: unread.count || 0,
        content: content.count || 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: t('admin.totalUsers'), value: stats.users, icon: Users, color: 'bg-primary/10 text-primary' },
    { label: t('admin.totalMessages'), value: stats.messages, icon: MessageSquare, color: 'bg-accent/10 text-accent' },
    { label: t('admin.unreadMessages'), value: stats.unread, icon: MessageSquare, color: 'bg-destructive/10 text-destructive' },
    { label: t('admin.contentSections'), value: stats.content, icon: FileText, color: 'bg-secondary text-secondary-foreground' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border shadow-sm">
          {loading ? (
            <Skeleton className="h-20" />
          ) : (
            <>
              <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="font-heading text-3xl font-bold text-card-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const UsersTab = () => {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setProfiles(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t('contact.name')}</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t('admin.joinedAt')}</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                <td className="p-4 text-foreground">{profile.display_name || '—'}</td>
                <td className="p-4 text-muted-foreground text-sm">{new Date(profile.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContentTab = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ section_key: '', title: '', content: '', image_url: '' });

  const fetchContents = async () => {
    const { data } = await supabase.from('site_content').select('*').order('section_key');
    setContents(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchContents(); }, []);

  const handleSave = async () => {
    if (editing) {
      await supabase.from('site_content').update({ title: form.title, content: form.content, image_url: form.image_url, updated_by: user?.id }).eq('id', editing);
    } else {
      await supabase.from('site_content').insert({ ...form, updated_by: user?.id });
    }
    toast({ title: t('admin.saved') });
    setEditing(null);
    setForm({ section_key: '', title: '', content: '', image_url: '' });
    fetchContents();
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
          <div>
            <span className="text-xs font-mono text-accent">{item.section_key}</span>
            <h4 className="font-heading font-bold text-foreground">{item.title || '—'}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setEditing(item.id); setForm({ section_key: item.section_key, title: item.title || '', content: item.content || '', image_url: item.image_url || '' }); }}>
            {t('admin.edit')}
          </Button>
        </div>
      ))}
    </div>
  );
};

const MessagesTab = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    await supabase.from('contact_messages').update({ is_read: !currentRead }).eq('id', id);
    fetchMessages();
  };

  if (loading) return <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>;

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">{t('admin.noMessages')}</div>
      ) : (
        messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`bg-card rounded-xl p-6 border ${msg.is_read ? 'border-border' : 'border-accent/50 bg-accent/5'} transition-colors`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-heading font-bold text-foreground">{msg.name}</h4>
                <p className="text-sm text-muted-foreground">{msg.email} {msg.phone && `· ${msg.phone}`}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</span>
                <Button variant="ghost" size="icon" onClick={() => toggleRead(msg.id, msg.is_read)} title={msg.is_read ? t('admin.markUnread') : t('admin.markRead')}>
                  {msg.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {msg.subject && <p className="text-sm font-medium text-foreground mb-2">{msg.subject}</p>}
            <p className="text-muted-foreground text-sm">{msg.message}</p>
          </motion.div>
        ))
      )}
    </div>
  );
};

const AlbumsTab = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlbums = async () => {
    const { data } = await supabase.from('albums').select('*').order('created_at', { ascending: false });
    setAlbums(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAlbums(); }, []);

  const deleteAlbum = async (id: string) => {
    await supabase.from('album_photos').delete().eq('album_id', id);
    await supabase.from('albums').delete().eq('id', id);
    toast({ title: 'Album supprimé' });
    fetchAlbums();
  };

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div className="space-y-6">
      <AlbumForm onSuccess={fetchAlbums} />

      <h3 className="font-heading text-lg font-bold text-foreground">Albums existants ({albums.length})</h3>

      {albums.map((album) => (
        <motion.div key={album.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-4 border border-border flex gap-4 items-center">
          {album.cover_image_url ? (
            <img src={album.cover_image_url} alt={album.title} className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Camera className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-bold text-foreground truncate">{album.title}</h4>
            <p className="text-sm text-muted-foreground">{album.category} · {new Date(album.created_at).toLocaleDateString()}</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => deleteAlbum(album.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminPage;
