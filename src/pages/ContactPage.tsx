import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' });

  const contactInfo = [
    { icon: MapPin, title: t('contact.address'), content: "Abidjan Marcory, Allée Oumé et\nTreichville en face de Sogelux\nCôte d'Ivoire" },
    { icon: Phone, title: t('contact.phones'), content: '+225 27 21 39 43 97\n+225 07 87 50 60 64' },
    { icon: Mail, title: t('contact.email'), content: 'info@hp-logistics.net' },
    { icon: Clock, title: t('contact.hours'), content: t('contact.hoursValue') },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({ title: t('contact.success'), description: t('contact.successDesc') });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-accent/90 text-accent-foreground text-sm font-semibold rounded-full mb-6">{t('contact.badge')}</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">{t('contact.title')}</h1>
            <p className="text-lg text-primary-foreground/90">{t('contact.description')}</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-8">{t('contact.info')}</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div key={info.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">{info.title}</h4>
                        <p className="text-muted-foreground text-sm whitespace-pre-line">{info.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl shadow-lg p-8 border border-border">
                {isSubmitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-3">{t('contact.success')}</h3>
                    <p className="text-muted-foreground mb-6">{t('contact.successDesc')}</p>
                    <Button variant="default" onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' }); }}>
                      {t('contact.sendAnother')}
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t('contact.sendMessage')}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">{t('contact.name')} *</label>
                          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder={t('contact.namePlaceholder')} required />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email *</label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t('contact.emailPlaceholder')} required />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">{t('contact.phone')}</label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder={t('contact.phonePlaceholder')} />
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">{t('contact.subject')} *</label>
                          <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder={t('contact.subjectPlaceholder')} required />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">{t('contact.message')} *</label>
                        <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder={t('contact.messagePlaceholder')} rows={5} required />
                      </div>
                      <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? t('contact.sending') : t('contact.send')}
                      </Button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">{t('contact.findUs')}</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{t('contact.mapTitle')}</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-xl border border-border"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.5!2d-3.995!3d5.305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1eb5a4567e493%3A0x7f8e5b3c5d6e7f8a!2sMarcory%2C%20Abidjan%2C%20C%C3%B4te%20d&#39;Ivoire!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="HP Logistics - Abidjan Marcory"
            />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
