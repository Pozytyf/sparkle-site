import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const fallbackTestimonials = [
  { id: '1', name: 'Amadou Koné', company: 'SOCOCE Import-Export', role: 'Directeur Commercial', content: 'HP LOGISTICS a transformé notre chaîne logistique. Leur réactivité et leur professionnalisme nous ont permis de réduire nos délais de livraison de 40%.', rating: 5 },
  { id: '2', name: 'Marie-Claire Bamba', company: 'Pharma Distribution CI', role: 'Responsable Logistique', content: "Excellente collaboration depuis 5 ans. L'équipe est toujours disponible et les procédures douanières sont gérées avec une grande expertise.", rating: 5 },
  { id: '3', name: 'Jean-Pierre Mensah', company: "Agro-Industries CI", role: 'PDG', content: "Nous faisons confiance à HP LOGISTICS pour toutes nos exportations vers l'Europe. Leur suivi en temps réel fait toute la différence.", rating: 5 },
  { id: '4', name: 'Fatou Diallo', company: 'Textiles Africains SARL', role: 'Directrice des Opérations', content: 'Un accompagnement de bout en bout impeccable. HP LOGISTICS comprend vraiment les besoins des PME ivoiriennes.', rating: 5 },
];

const TestimonialsSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', role: '', content: '', rating: 5 });

  useEffect(() => {
    const fetchApproved = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setTestimonials(data.map(d => ({ id: d.id, name: d.name, company: d.company || '', role: d.role || '', content: d.content, rating: d.rating })));
      }
    };
    fetchApproved();
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('testimonials').insert({
      name: form.name.trim().slice(0, 100),
      company: form.company.trim().slice(0, 100) || null,
      role: form.role.trim().slice(0, 100) || null,
      content: form.content.trim().slice(0, 1000),
      rating: form.rating,
    });
    setSubmitting(false);
    if (!error) {
      toast({ title: t('testimonials.submitted'), description: t('testimonials.submittedDesc') });
      setForm({ name: '', company: '', role: '', content: '', rating: 5 });
      setShowForm(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95, transition: { duration: 0.3 } }),
  };

  const testimonial = testimonials[current];

  return (
    <section className="section-padding bg-muted overflow-hidden">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            {t('testimonials.badge')}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('testimonials.title1')} <span className="text-accent">{t('testimonials.title2')}</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-muted-foreground text-lg">
            {t('testimonials.description')}
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <button onClick={prev} className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300">
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="overflow-hidden px-4">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={current} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="bg-card rounded-2xl p-8 md:p-12 shadow-xl border border-border relative">
                <div className="absolute top-6 right-8 text-accent/15"><Quote className="h-16 w-16" /></div>
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                      <Star className="h-5 w-5 fill-accent text-accent" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-foreground text-lg md:text-xl leading-relaxed mb-8 relative z-10 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-accent flex items-center justify-center">
                    <span className="font-heading font-bold text-accent-foreground text-lg">{testimonial.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground text-lg">{testimonial.name}</h4>
                    <p className="text-muted-foreground text-sm">{testimonial.role} • {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button key={index} onClick={() => { setDirection(index > current ? 1 : -1); setCurrent(index); }} className={`h-2.5 rounded-full transition-all duration-500 ${index === current ? 'w-8 bg-accent' : 'w-2.5 bg-border hover:bg-muted-foreground'}`} />
            ))}
          </div>
        </div>

        {/* Submit testimonial */}
        <div className="text-center mt-12">
          <Button variant="outline" onClick={() => setShowForm(!showForm)} className="gap-2">
            <Send className="h-4 w-4" /> {t('testimonials.share')}
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="max-w-xl mx-auto mt-8 bg-card rounded-xl p-6 border border-border shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder={t('contact.name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={100} />
                <Input placeholder={t('testimonials.company')} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} maxLength={100} />
              </div>
              <Input placeholder={t('testimonials.role')} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} maxLength={100} />
              <div className="flex gap-1 items-center">
                <span className="text-sm text-muted-foreground mr-2">{t('testimonials.rating')}:</span>
                {[1, 2, 3, 4, 5].map(r => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })}>
                    <Star className={`h-5 w-5 ${r <= form.rating ? 'fill-accent text-accent' : 'text-border'}`} />
                  </button>
                ))}
              </div>
              <Textarea placeholder={t('testimonials.yourMessage')} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required maxLength={1000} rows={4} />
              <Button type="submit" variant="accent" disabled={submitting} className="w-full">
                {submitting ? t('contact.sending') : t('testimonials.submit')}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TestimonialsSection;
