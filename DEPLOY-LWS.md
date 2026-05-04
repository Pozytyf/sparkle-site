# 🚀 Guide de déploiement HP Logistics sur LWS

Ce guide vous accompagne pour publier le site sur votre hébergement **LWS** avec votre domaine **hp-logistics.net**.

---

## ⚠️ Architecture importante

Votre site est composé de **2 parties** :

| Partie | Hébergement | Pourquoi |
|---|---|---|
| **Frontend** (HTML/CSS/JS) | LWS (votre choix) | Statique, uploadable par FTP |
| **Backend** (base de données, auth, CMS, devis, photos) | **Lovable Cloud (Supabase)** | Reste obligatoirement chez Supabase |

> 🔑 **À retenir** : Le frontend hébergé chez LWS continuera de communiquer avec Supabase via Internet (URL `qdbbltkqldzuwxecfhin.supabase.co` codée en dur dans le build). Si vous coupez Supabase, **le site frontend s'affiche mais le CMS / login / devis / photos ne fonctionneront plus**.

---

## 📋 Étape 1 — Configurer les DNS chez LWS

LWS vous a donné ces nameservers :
```
ns17.lwsdns.com
ns18.lwsdns.com
ns19.lwsdns.com
ns20.lwsdns.com
```

➡️ Connectez-vous à votre **panneau LWS** (`panel.lws.fr` ou `panel.lws.eu`) :

1. Allez dans **Domaines → hp-logistics.net → Gérer les DNS**
2. Vérifiez que les 4 nameservers ci-dessus sont bien actifs (ils le sont par défaut chez LWS)
3. Si le domaine vient d'un autre registrar (OVH, Gandi…), pointez les nameservers du registrar vers les 4 ns LWS ci-dessus

⏱️ Propagation DNS : **24 à 72 h max**.

---

## 📦 Étape 2 — Builder le site (générer les fichiers à uploader)

Vous avez besoin de **Node.js** installé sur votre PC (https://nodejs.org).

### 2.1 — Récupérer le code via GitHub

Dans Lovable, en haut à droite, cliquez sur **GitHub → Connect to GitHub** et créez le repo. Puis sur votre PC :

```bash
git clone https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
cd VOTRE-REPO
```

### 2.2 — Installer les dépendances et builder

```bash
npm install
npm run build
```

✅ Cela crée un dossier `dist/` avec **tous les fichiers à uploader**.

> Le fichier `public/.htaccess` est automatiquement copié dans `dist/.htaccess` par Vite.

---

## 📤 Étape 3 — Uploader le contenu du dossier `dist/` chez LWS

### Option A — FileZilla (recommandé, gratuit)

1. Téléchargez **FileZilla** : https://filezilla-project.org/
2. Récupérez vos identifiants FTP dans **panneau LWS → Hébergement → FTP**
   - Hôte : `ftp.hp-logistics.net` (ou l'IP fournie)
   - Utilisateur : votre login FTP
   - Mot de passe : votre mot de passe FTP
   - Port : `21` (FTP) ou `22` (SFTP si dispo)
3. Connectez-vous
4. À droite (serveur), allez dans le dossier **`/www/`** ou **`/public_html/`** (selon votre offre LWS)
5. **Supprimez** tout fichier existant à l'intérieur (souvent un `index.html` LWS par défaut)
6. À gauche (votre PC), allez dans le dossier `dist/` de votre projet
7. **Sélectionnez tout** (Ctrl+A) → glissez-déposez vers le dossier serveur
8. Attendez la fin de l'upload (1-2 min selon connexion)

### Option B — Gestionnaire de fichiers LWS (sans logiciel)

1. Panneau LWS → **Hébergement → Gestionnaire de fichiers**
2. Allez dans `/www/`
3. Supprimez les fichiers existants
4. Cliquez **Téléverser** → sélectionnez **TOUS** les fichiers de `dist/` (y compris `.htaccess`)

⚠️ **Important** : le fichier `.htaccess` est caché par défaut. Activez "Afficher les fichiers cachés" dans FileZilla (`Affichage → Forcer l'affichage des fichiers cachés`).

---

## 🔒 Étape 4 — Activer le HTTPS (SSL gratuit Let's Encrypt)

1. Panneau LWS → **Hébergement → SSL / HTTPS**
2. Cliquez **Activer Let's Encrypt** sur `hp-logistics.net` et `www.hp-logistics.net`
3. Attendez 5-10 min
4. Une fois actif : éditez `.htaccess` sur le serveur et **décommentez** les 2 lignes "Forcer HTTPS" (retirez les `#`)

---

## ✅ Étape 5 — Vérifier que tout fonctionne

Testez ces URLs après propagation DNS :

- ✅ `https://hp-logistics.net` → page d'accueil
- ✅ `https://hp-logistics.net/services` → ne doit PAS faire 404 (test du SPA fallback)
- ✅ `https://hp-logistics.net/contact` → ne doit PAS faire 404
- ✅ Faire F5 (refresh) sur `/services` → ne doit PAS faire 404
- ✅ Login admin → doit fonctionner (preuve que la connexion à Supabase passe)
- ✅ Modifier un texte dans le CMS → doit s'enregistrer

Si une URL fait **404 au refresh**, le `.htaccess` n'est pas en place. Re-uploadez-le et vérifiez qu'il est bien à la racine du dossier `/www/`.

---

## 🔄 Mises à jour du site

Chaque fois que vous voulez publier de nouvelles modifications faites dans Lovable :

```bash
cd VOTRE-REPO
git pull             # récupère les changements de Lovable
npm install          # si de nouvelles librairies
npm run build        # regénère dist/
```

Puis ré-uploader le contenu de `dist/` chez LWS (FileZilla : sélectionner tout, écraser).

> 💡 **Astuce** : Vous pouvez automatiser ça avec un script `deploy.sh` (FTP via `lftp` ou GitHub Actions vers FTP).

---

## ❓ Problèmes fréquents

| Problème | Solution |
|---|---|
| Page blanche | Ouvrir la console (F12) — souvent un mauvais chemin de base. Vérifier que le build a bien copié les fichiers JS/CSS |
| 404 au refresh sur /services | `.htaccess` manquant ou mal placé. Doit être à la **racine** du `/www/` |
| Le login ne marche pas | Cookies bloqués / problème CORS. Vérifier que `https://hp-logistics.net` est autorisé dans Supabase → Auth → URL Configuration |
| Images CMS cassées | Les uploads sont sur Supabase Storage, ils restent accessibles. Vider le cache navigateur |
| HTTPS pas actif | Patience 24h après activation Let's Encrypt, ou re-cliquer sur "Renouveler" |

---

## 📞 Support

- **LWS** : https://aide.lws.fr | tel : 01 77 62 30 03
- **Supabase / Lovable Cloud** : géré dans Lovable directement
