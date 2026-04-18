-- Index for fast lookup
CREATE UNIQUE INDEX IF NOT EXISTS site_content_section_key_idx ON public.site_content (section_key);

-- Seed initial CMS content (only insert if missing) so admin sees current values
INSERT INTO public.site_content (section_key, title, content) VALUES
  ('hero_badge', 'Badge Hero', '🚀 Solutions logistiques globales'),
  ('hero_title', 'Titre Hero', 'Votre partenaire logistique de confiance en Afrique'),
  ('hero_subtitle', 'Sous-titre Hero', 'HP LOGISTICS – Solutions complètes de transport maritime, aérien, routier et ferroviaire pour votre entreprise.'),
  ('about_title', 'Titre À Propos', 'À propos de HP LOGISTICS'),
  ('about_content', 'Contenu À Propos', 'HP LOGISTICS est une entreprise leader dans le secteur de la logistique en Côte d''Ivoire, offrant des solutions complètes et personnalisées à ses clients.

Forte de plus de 10 ans d''expérience, notre équipe d''experts maîtrise toutes les facettes du transport international et de la chaîne logistique.

Nous nous engageons à fournir un service de qualité supérieure, alliant fiabilité, réactivité et transparence.'),
  ('about_image', 'Image À Propos', ''),
  ('services_title', 'Titre Services', 'Nos Services'),
  ('services_description', 'Description Services', 'Une gamme complète de services logistiques pour répondre à tous vos besoins.'),
  ('contact_address', 'Adresse', 'Abidjan Marcory, Allée Oumé et Treichville en face de Sogelux, Côte d''Ivoire'),
  ('contact_phone', 'Téléphone', '+225 27 21 39 43 97
+225 07 87 50 60 64'),
  ('contact_email', 'Email', 'info@hp-logistics.net'),
  ('contact_lat', 'Latitude (Maps)', '5.298117'),
  ('contact_lng', 'Longitude (Maps)', '-4.009506'),
  ('contact_maps', 'URL embed Maps (optionnel)', ''),
  ('cta_title', 'Titre CTA', 'Prêt à optimiser votre chaîne logistique ?'),
  ('cta_description', 'Description CTA', 'Contactez-nous dès aujourd''hui pour un devis personnalisé.'),
  ('footer_description', 'Description Footer', 'HP LOGISTICS – Votre partenaire logistique de confiance pour le transport international en Afrique de l''Ouest.'),
  ('footer_facebook', 'Facebook', 'https://www.facebook.com/hplogistics'),
  ('footer_linkedin', 'LinkedIn', ''),
  ('footer_instagram', 'Instagram/Twitter', '')
ON CONFLICT (section_key) DO NOTHING;