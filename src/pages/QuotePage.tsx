import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Ship, Plane, Truck, Train, ArrowRightLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EditableText } from '@/components/cms/EditableText';

const QuotePage = () => {
  const { t } = useLanguage();
  const transportModes = [
    { value: 'maritime', icon: Ship, label: t('transport.maritime') },
    { value: 'aerien', icon: Plane, label: t('transport.air') },
    { value: 'routier', icon: Truck, label: t('transport.road') },
    { value: 'ferroviaire', icon: Train, label: t('transport.rail') },
    { value: 'multimodal', icon: ArrowRightLeft, label: t('transport.multimodal') },
  ];
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', goods_type: '', weight: '', origin: '', destination: '', transport_mode: 'maritime', details: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('quote_requests').insert({
      ...form,
      name: form.name.trim().slice(0, 100),
      email: form.email.trim().slice(0, 255),
      phone: form.phone.trim().slice(0, 30) || null,
      goods_type: form.goods_type.trim().slice(0, 200),
      weight: form.weight.trim().slice(0, 50) || null,
      origin: form.origin.trim().slice(0, 200),
      destination: form.destination.trim().slice(0, 200),
      details: form.details.trim().slice(0, 2000) || null,
      user_id: user?.id || null,
    });
    setSubmitting(false);
    if (!error) {
      setSubmitted(true);
      toast({ title: t('quote.success') });
    }
  };

  return (
    <Layout>
      <section className="relative pt-32 pb-10 bg-primary overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-accent/90 text-accent-foreground text-sm font-semibold rounded-full mb-4">
              <FileText className="inline h-4 w-4 mr-1" />
              <EditableText contentKey="quote_badge" fallback={t('quote.badge')} label="Badge Devis" />
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">
              <EditableText contentKey="quote_title" fallback={t('quote.title')} label="Titre Devis" />
            </h1>
            <p className="text-primary-foreground/80 mt-3 text-lg">
              <EditableText contentKey="quote_description" fallback={t('quote.description')} label="Description Devis" multiline as="span" />
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">{t('quote.success')}</h2>
              <p className="text-muted-foreground mb-6">{t('quote.successDesc')}</p>
              <Button variant="accent" onClick={() => setSubmitted(false)}>{t('quote.another')}</Button>
            </motion.div>
          ) : (
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-6">
              {/* Contact info */}
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">{t('quote.contactInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder={t('contact.name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={100} />
                  <Input type="email" placeholder={t('contact.email')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required maxLength={255} />
                  <Input placeholder={t('contact.phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={30} />
                </div>
              </div>

              {/* Goods info */}
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">{t('quote.goodsInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder={t('quote.goodsType')} value={form.goods_type} onChange={e => setForm({ ...form, goods_type: e.target.value })} required maxLength={200} />
                  <Input placeholder={t('quote.weight')} value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} maxLength={50} />
                </div>
              </div>

              {/* Route */}
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">{t('quote.route')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder={t('quote.origin')} value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} required maxLength={200} />
                  <Input placeholder={t('quote.destination')} value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required maxLength={200} />
                </div>
              </div>

              {/* Transport mode */}
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">{t('quote.transportMode')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {transportModes.map(m => (
                    <button key={m.value} type="button" onClick={() => setForm({ ...form, transport_mode: m.value })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${form.transport_mode === m.value ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-card text-muted-foreground hover:border-accent/30'}`}>
                      <m.icon className="h-6 w-6" />
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Textarea placeholder={t('quote.details')} value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} rows={4} maxLength={2000} />

              <Button type="submit" variant="accent" size="lg" className="w-full" disabled={submitting}>
                {submitting ? t('contact.sending') : t('quote.submit')}
              </Button>
            </motion.form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default QuotePage;
