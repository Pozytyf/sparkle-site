import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Type, Image as ImageIcon, FileText, Palette, RotateCcw, MapPin, Search, History as HistoryIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import RichTextEditor from '@/components/cms/RichTextEditor';
import SiteContentHistory from './SiteContentHistory';

type FieldType = 'text' | 'textarea' | 'image' | 'url' | 'maps' | 'rich';

interface Field {
  label: string;
  type: FieldType;
  key: string;
  hint?: string;
  defaultValue?: string;
}

interface SectionConfig {
  key: string;
  label: string;
  description: string;
  fields: Field[];
}

const sections: SectionConfig[] = [
  {
    key: 'hero',
    label: '🏠 Bannière Hero',
    description: 'Textes principaux affichés en haut de la page d\'accueil',
    fields: [
      { key: 'hero_badge', label: 'Badge', type: 'text', hint: 'Petit texte au-dessus du titre', defaultValue: '🚀 Solutions logistiques globales' },
      { key: 'hero_title', label: 'Titre principal', type: 'text', defaultValue: 'Votre partenaire logistique de confiance en Afrique' },
      { key: 'hero_subtitle', label: 'Sous-titre', type: 'textarea', defaultValue: 'HP LOGISTICS – Solutions complètes de transport...' },
    ],
  },
  {
    key: 'about',
    label: '📖 Page À Propos',
    description: 'Contenu de la page À propos',
    fields: [
      { key: 'about_title', label: 'Titre', type: 'text', defaultValue: 'À propos de HP LOGISTICS' },
      { key: 'about_content', label: 'Contenu (riche)', type: 'rich', hint: 'Mise en forme : gras, italique, listes, liens' },
      { key: 'about_image', label: 'Image principale', type: 'image' },
    ],
  },
  {
    key: 'services',
    label: '🚚 Services (4 modes)',
    description: 'Titre, description et image de chaque mode de transport',
    fields: [
      { key: 'services_title', label: 'Titre section', type: 'text', defaultValue: 'Nos Services' },
      { key: 'services_description', label: 'Description section', type: 'textarea' },
      { key: 'service_road_title', label: '🚛 Routier - Titre', type: 'text', defaultValue: 'Transport Routier' },
      { key: 'service_road_desc', label: '🚛 Routier - Description', type: 'textarea' },
      { key: 'service_road_image', label: '🚛 Routier - Image', type: 'image' },
      { key: 'service_air_title', label: '✈️ Aérien - Titre', type: 'text', defaultValue: 'Transport Aérien' },
      { key: 'service_air_desc', label: '✈️ Aérien - Description', type: 'textarea' },
      { key: 'service_air_image', label: '✈️ Aérien - Image', type: 'image' },
      { key: 'service_maritime_title', label: '🚢 Maritime - Titre', type: 'text', defaultValue: 'Transport Maritime' },
      { key: 'service_maritime_desc', label: '🚢 Maritime - Description', type: 'textarea' },
      { key: 'service_maritime_image', label: '🚢 Maritime - Image', type: 'image' },
      { key: 'service_rail_title', label: '🚆 Ferroviaire - Titre', type: 'text', defaultValue: 'Transport Ferroviaire' },
      { key: 'service_rail_desc', label: '🚆 Ferroviaire - Description', type: 'textarea' },
      { key: 'service_rail_image', label: '🚆 Ferroviaire - Image', type: 'image' },
    ],
  },
  {
    key: 'advantages',
    label: '⭐ Page Atouts',
    description: 'Hero, statistiques et CTA de la page atouts',
    fields: [
      { key: 'advantages_title', label: 'Titre Hero', type: 'text' },
      { key: 'advantages_description', label: 'Description Hero', type: 'textarea' },
      { key: 'advantages_trust_cta', label: 'Titre CTA bas', type: 'text' },
      { key: 'advantages_trust_desc', label: 'Description CTA bas', type: 'textarea' },
    ],
  },
  {
    key: 'realisations',
    label: '📸 Page Réalisations',
    description: 'Titre et description de la page portfolio',
    fields: [
      { key: 'realisations_badge', label: 'Badge', type: 'text', defaultValue: 'Nos Réalisations' },
      { key: 'realisations_title', label: 'Titre', type: 'text', defaultValue: 'Découvrez nos réalisations' },
      { key: 'realisations_description', label: 'Description', type: 'textarea' },
    ],
  },
  {
    key: 'quote',
    label: '📝 Page Devis',
    description: 'Titre et description du formulaire de devis',
    fields: [
      { key: 'quote_badge', label: 'Badge', type: 'text', defaultValue: 'Devis gratuit' },
      { key: 'quote_title', label: 'Titre', type: 'text' },
      { key: 'quote_description', label: 'Description', type: 'textarea' },
    ],
  },
  {
    key: 'cta',
    label: '📣 Bandeau CTA',
    description: 'Appel à l\'action en bas de la page d\'accueil',
    fields: [
      { key: 'cta_title', label: 'Titre', type: 'text' },
      { key: 'cta_description', label: 'Description', type: 'textarea' },
    ],
  },
  {
    key: 'contact',
    label: '📍 Contact & Maps',
    description: 'Coordonnées et localisation',
    fields: [
      { key: 'contact_address', label: 'Adresse postale', type: 'textarea' },
      { key: 'contact_phone', label: 'Téléphone(s)', type: 'textarea', hint: 'Un par ligne' },
      { key: 'contact_email', label: 'Email', type: 'text' },
      { key: 'contact_lat', label: 'Latitude (Maps)', type: 'text', hint: 'Ex: 5.298117' },
      { key: 'contact_lng', label: 'Longitude (Maps)', type: 'text', hint: 'Ex: -4.009506' },
      { key: 'contact_maps', label: 'OU URL embed Maps', type: 'maps', hint: 'Si renseigné, prioritaire sur lat/lng' },
    ],
  },
  {
    key: 'footer',
    label: '⬇️ Pied de page',
    description: 'Description et réseaux sociaux',
    fields: [
      { key: 'footer_description', label: 'Description entreprise', type: 'textarea' },
      { key: 'footer_facebook', label: 'Facebook URL', type: 'url' },
      { key: 'footer_linkedin', label: 'LinkedIn URL', type: 'url' },
      { key: 'footer_instagram', label: 'Instagram/Twitter URL', type: 'url' },
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
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'editor' | 'history'>('editor');

  const fetchContent = async () => {
    const { data } = await supabase.from('site_content').select('*');
    const map: Record<string, any> = {};
    (data || []).forEach(item => { map[item.section_key] = item; });
    setContentMap(map);
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

  // Show draft value if pending, else live content
  const getValue = (key: string): string => {
    const row = contentMap[key];
    if (!row) return '';
    return row.has_draft && row.draft_content !== null ? row.draft_content : (row.content || '');
  };
  const isDraft = (key: string): boolean => !!contentMap[key]?.has_draft;

  const handleSave = async (field: Field, value: string) => {
    setSaving(field.key);
    const existing = contentMap[field.key];
    if (existing) {
      await supabase.from('site_content').update({
        draft_content: value,
        has_draft: true,
        draft_updated_at: new Date().toISOString(),
        draft_updated_by: user?.id,
        title: field.label,
      }).eq('id', existing.id);
    } else {
      await supabase.from('site_content').insert({
        section_key: field.key,
        content: '',
        draft_content: value,
        has_draft: true,
        draft_updated_at: new Date().toISOString(),
        draft_updated_by: user?.id,
        title: field.label,
      });
    }
    toast({ title: '📝 Brouillon sauvegardé', description: `${field.label} — cliquez sur "Publier" en haut pour mettre en ligne.` });
    setSaving(null);
    fetchContent();
  };

  const handleReset = async (field: Field) => {
    if (!field.defaultValue) return;
    await handleSave(field, field.defaultValue);
  };

  const handleImageUpload = async (key: string, label: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(key);
    const ext = file.name.split('.').pop();
    const path = `content/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('site-images').upload(path, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
      await handleSave({ key, label, type: 'image' }, urlData.publicUrl);
    } else {
      toast({ title: 'Erreur upload', description: error.message, variant: 'destructive' });
    }
    setUploading(null);
    e.target.value = '';
  };

  if (loading) return <div className="space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  // Filter sections by search
  const filteredSections = search
    ? sections.map(s => ({
        ...s,
        fields: s.fields.filter(f => f.label.toLowerCase().includes(search.toLowerCase()) || f.key.toLowerCase().includes(search.toLowerCase())),
      })).filter(s => s.fields.length > 0)
    : sections;

  const currentSection = filteredSections.find(s => s.key === activeSection) || filteredSections[0];

  return (
    <div className="space-y-6">
      {/* Header with search + view toggle */}
      <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl p-5 border border-accent/20">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Palette className="h-5 w-5 text-accent" />
              Framework CMS
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Modifiez tous les textes et images du site. Les changements s'appliquent en temps réel.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setView('editor')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'editor' ? 'bg-accent text-accent-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
              >
                <Palette className="inline h-3 w-3 mr-1" /> Éditeur
              </button>
              <button
                onClick={() => setView('history')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'history' ? 'bg-accent text-accent-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
              >
                <HistoryIcon className="inline h-3 w-3 mr-1" /> Historique
              </button>
            </div>
            {view === 'editor' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un champ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64 text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {view === 'history' ? (
        <SiteContentHistory />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {filteredSections.map(section => (
              <Button
                key={section.key}
                variant={currentSection?.key === section.key ? 'accent' : 'outline'}
                size="sm"
                onClick={() => setActiveSection(section.key)}
                className="text-xs"
              >
                {section.label}
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-background/30 text-[10px]">
                  {section.fields.length}
                </span>
              </Button>
            ))}
          </div>

          {currentSection && (
            <motion.div
              key={currentSection.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="mb-6">
                <h3 className="font-heading text-lg font-bold text-foreground">{currentSection.label}</h3>
                <p className="text-sm text-muted-foreground">{currentSection.description}</p>
              </div>

              <div className="space-y-5">
                {currentSection.fields.map(field => (
                  <FieldEditor
                    key={field.key}
                    field={field}
                    value={getValue(field.key)}
                    onSave={(value) => handleSave(field, value)}
                    onReset={() => handleReset(field)}
                    saving={saving === field.key}
                    uploading={uploading === field.key}
                    onImageUpload={(e) => handleImageUpload(field.key, field.label, e)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

interface FieldEditorProps {
  field: Field;
  value: string;
  onSave: (value: string) => void;
  onReset: () => void;
  saving: boolean;
  uploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FieldEditor = ({ field, value, onSave, onReset, saving, uploading, onImageUpload }: FieldEditorProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setLocalValue(value); setDirty(false); }, [value]);

  const handleChange = (v: string) => { setLocalValue(v); setDirty(v !== value); };

  const icon = field.type === 'image' ? <ImageIcon className="h-4 w-4" /> :
    field.type === 'textarea' ? <FileText className="h-4 w-4" /> :
    field.type === 'maps' || field.type === 'url' ? <MapPin className="h-4 w-4" /> :
    <Type className="h-4 w-4" />;

  return (
    <div className={`border rounded-lg p-4 transition-colors ${dirty ? 'border-accent bg-accent/5' : 'border-border'}`}>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          {field.label}
          {dirty && <span className="text-xs text-accent">● modifié</span>}
        </label>
        <div className="flex gap-1.5">
          {field.defaultValue && (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-xs h-7 text-muted-foreground" title="Réinitialiser">
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
          {dirty && (
            <Button variant="accent" size="sm" onClick={() => onSave(localValue)} disabled={saving} className="text-xs h-7">
              <Save className="h-3 w-3 mr-1" />
              {saving ? '...' : 'Sauver'}
            </Button>
          )}
        </div>
      </div>
      {field.hint && <p className="text-xs text-muted-foreground mb-2 italic">{field.hint}</p>}

      {field.type === 'rich' ? (
        <RichTextEditor value={localValue} onChange={handleChange} />
      ) : field.type === 'textarea' ? (
        <Textarea value={localValue} onChange={(e) => handleChange(e.target.value)} rows={4} className="text-sm" />
      ) : field.type === 'image' ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input value={localValue} onChange={(e) => handleChange(e.target.value)} placeholder="URL de l'image" className="flex-1 text-sm" />
            <label className="cursor-pointer flex items-center gap-1 text-xs border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
              <Upload className="h-3 w-3" />
              {uploading ? '...' : 'Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
            </label>
          </div>
          {localValue && <img src={localValue} alt="Preview" className="h-24 w-auto rounded-lg object-cover border border-border" />}
        </div>
      ) : (
        <Input value={localValue} onChange={(e) => handleChange(e.target.value)} className="text-sm" />
      )}

      {/* Live character counter for text */}
      {(field.type === 'text' || field.type === 'textarea') && localValue && (
        <p className="text-[10px] text-muted-foreground mt-1 text-right">{localValue.length} caractères</p>
      )}
    </div>
  );
};

export default SiteContentManager;
