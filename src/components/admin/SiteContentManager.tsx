import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Type, Image as ImageIcon, FileText, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface SectionConfig {
  key: string;
  label: string;
  description: string;
  fields: Array<{ name: string; label: string; type: 'text' | 'textarea' | 'image' | 'url'; key: string }>;
}

const sections: SectionConfig[] = [
  {
    key: 'hero',
    label: 'Bannière Hero',
    description: 'Textes principaux de la page d\'accueil',
    fields: [
      { name: 'badge', label: 'Badge (texte court)', type: 'text', key: 'hero_badge' },
      { name: 'title', label: 'Titre principal', type: 'text', key: 'hero_title' },
      { name: 'subtitle', label: 'Sous-titre', type: 'textarea', key: 'hero_subtitle' },
    ],
  },
  {
    key: 'about',
    label: 'Page À Propos',
    description: 'Contenu de la page à propos',
    fields: [
      { name: 'title', label: 'Titre', type: 'text', key: 'about_title' },
      { name: 'content', label: 'Contenu principal', type: 'textarea', key: 'about_content' },
      { name: 'image', label: 'Image', type: 'image', key: 'about_image' },
    ],
  },
  {
    key: 'services',
    label: 'Page Services',
    description: 'Contenu de la section services',
    fields: [
      { name: 'title', label: 'Titre de section', type: 'text', key: 'services_title' },
      { name: 'description', label: 'Description', type: 'textarea', key: 'services_description' },
    ],
  },
  {
    key: 'contact',
    label: 'Page Contact',
    description: 'Informations de contact',
    fields: [
      { name: 'address', label: 'Adresse', type: 'text', key: 'contact_address' },
      { name: 'phone', label: 'Téléphone', type: 'text', key: 'contact_phone' },
      { name: 'email', label: 'Email', type: 'text', key: 'contact_email' },
      { name: 'maps_url', label: 'URL Google Maps (iframe)', type: 'url', key: 'contact_maps' },
    ],
  },
  {
    key: 'footer',
    label: 'Pied de page',
    description: 'Informations du footer',
    fields: [
      { name: 'description', label: 'Description entreprise', type: 'textarea', key: 'footer_description' },
      { name: 'facebook', label: 'Facebook URL', type: 'url', key: 'footer_facebook' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'url', key: 'footer_linkedin' },
      { name: 'instagram', label: 'Instagram URL', type: 'url', key: 'footer_instagram' },
    ],
  },
  {
    key: 'cta',
    label: 'Section CTA',
    description: 'Appel à l\'action de la page d\'accueil',
    fields: [
      { name: 'title', label: 'Titre', type: 'text', key: 'cta_title' },
      { name: 'description', label: 'Description', type: 'textarea', key: 'cta_description' },
    ],
  },
];

const SiteContentManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [contentMap, setContentMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchContent = async () => {
    const { data } = await supabase.from('site_content').select('*');
    const map: Record<string, any> = {};
    (data || []).forEach(item => { map[item.section_key] = item; });
    setContentMap(map);
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

  const getValue = (key: string): string => {
    return contentMap[key]?.content || contentMap[key]?.title || '';
  };

  const handleSave = async (field: { key: string; label: string; type: string }, value: string) => {
    setSaving(field.key);
    const existing = contentMap[field.key];
    if (existing) {
      await supabase.from('site_content').update({
        content: value,
        title: field.label,
        updated_by: user?.id,
      }).eq('id', existing.id);
    } else {
      await supabase.from('site_content').insert({
        section_key: field.key,
        content: value,
        title: field.label,
        updated_by: user?.id,
      });
    }
    toast({ title: `"${field.label}" sauvegardé` });
    setSaving(null);
    fetchContent();
  };

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(key);
    const ext = file.name.split('.').pop();
    const path = `content/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('site-images').upload(path, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
      await handleSave({ key, label: key, type: 'image' }, urlData.publicUrl);
    }
    setUploading(null);
  };

  if (loading) return <div className="space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  const currentSection = sections.find(s => s.key === activeSection);

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map(section => (
          <Button
            key={section.key}
            variant={activeSection === section.key ? 'accent' : 'outline'}
            size="sm"
            onClick={() => setActiveSection(section.key)}
            className="text-xs"
          >
            {section.label}
          </Button>
        ))}
      </div>

      {/* Active section editor */}
      {currentSection && (
        <motion.div
          key={currentSection.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Palette className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">{currentSection.label}</h3>
              <p className="text-sm text-muted-foreground">{currentSection.description}</p>
            </div>
          </div>

          <div className="space-y-5">
            {currentSection.fields.map(field => (
              <FieldEditor
                key={field.key}
                field={field}
                value={getValue(field.key)}
                onSave={(value) => handleSave(field, value)}
                saving={saving === field.key}
                uploading={uploading === field.key}
                onImageUpload={(e) => handleImageUpload(field.key, e)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface FieldEditorProps {
  field: { name: string; label: string; type: string; key: string };
  value: string;
  onSave: (value: string) => void;
  saving: boolean;
  uploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FieldEditor = ({ field, value, onSave, saving, uploading, onImageUpload }: FieldEditorProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setLocalValue(value); setDirty(false); }, [value]);

  const handleChange = (v: string) => {
    setLocalValue(v);
    setDirty(v !== value);
  };

  const icon = field.type === 'image' ? <ImageIcon className="h-4 w-4" /> :
    field.type === 'textarea' ? <FileText className="h-4 w-4" /> :
    field.type === 'url' ? <ImageIcon className="h-4 w-4" /> :
    <Type className="h-4 w-4" />;

  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          {field.label}
        </label>
        {dirty && (
          <Button variant="accent" size="sm" onClick={() => { onSave(localValue); setDirty(false); }} disabled={saving} className="text-xs h-7">
            <Save className="h-3 w-3 mr-1" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        )}
      </div>

      {field.type === 'textarea' ? (
        <Textarea
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          rows={3}
          className="text-sm"
        />
      ) : field.type === 'image' ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="URL de l'image"
              className="flex-1 text-sm"
            />
            <label className="cursor-pointer flex items-center gap-1 text-xs border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors text-muted-foreground">
              <Upload className="h-3 w-3" />
              {uploading ? '...' : 'Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
            </label>
          </div>
          {localValue && (
            <img src={localValue} alt="Preview" className="h-20 w-auto rounded-lg object-cover border border-border" />
          )}
        </div>
      ) : (
        <Input
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="text-sm"
        />
      )}
    </div>
  );
};

export default SiteContentManager;
