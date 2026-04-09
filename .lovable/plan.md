## Plan d'implémentation

### 1. Parallaxe + Skeletons (pas de backend requis)
- Créer un composant `ParallaxSection` réutilisable pour les héros et séparateurs visuels
- Créer un composant `PageSkeleton` pour les animations de chargement
- Appliquer le parallaxe sur les pages existantes (hero + bandes entre sections)

### 2. Google Maps iframe sur la page Contact
- Ajouter une section avec une carte embarquée (iframe Google Maps) pointant vers les bureaux d'Abidjan Marcory
- Responsive et stylée avec le design system

### 3. Authentification + Admin (nécessite Lovable Cloud)
- Activer Lovable Cloud
- Créer les tables nécessaires (profiles, user_roles, site_content)
- Pages auth : Login, Register, Reset password
- Dashboard admin avec sidebar : 
  - Gestion utilisateurs
  - Gestion contenu (textes, images)
  - Tableau de bord analytics basique
- Protection des routes admin par rôle

### Ordre d'exécution
Étapes 1-2 d'abord (pas de dépendance backend), puis étape 3 après activation de Cloud.
