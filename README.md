# HP LOGISTICS — Site officiel

Site web bilingue (FR/EN) de **HP LOGISTICS** (Holy Price Logistics Worldwide), spécialiste du transit et de la logistique internationale en Afrique.

## Stack technique

- React 18 + Vite 5 + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- React Query (cache & data fetching)
- Backend managé (Postgres + Auth + Storage)

## Développement local

```bash
npm install
npm run dev
```

Le site est disponible sur `http://localhost:8080`.

## Build production

```bash
npm run build
```

Le dossier `dist/` contient le site statique prêt à être uploadé.

## Déploiement LWS (Apache mutualisé)

Voir [`DEPLOY-LWS.md`](./DEPLOY-LWS.md) pour la procédure complète :

1. `npm run build`
2. Upload du contenu de `dist/` à la racine FTP (`/www/` ou `/public_html/`)
3. Le fichier `.htaccess` (déjà inclus via `public/`) gère le SPA fallback, GZIP et le cache.

## Fonctionnalités

- Site vitrine bilingue avec CMS intégré (mode brouillon, publication, historique)
- Espace client avec suivi temps réel des expéditions
- Demandes de devis multimodales (maritime / aérien / routier / ferroviaire)
- Galerie de réalisations filtrable + lightbox
- Authentification admin / utilisateur (rôles séparés)
- SEO multilingue (hreflang FR/EN, Open Graph, canonical)
- Bandeau de consentement cookies RGPD
