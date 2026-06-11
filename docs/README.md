# 🦋🚀 Les Vacances de Maya et Aaron

Cahier de vacances interactif — Progressive Web App

## Contenu pédagogique

### 🦋 Maya (CE1 → CE2, 7-8 ans)
| Session | Matière |
|---------|---------|
| Les sons mystérieux (o/au/eau) | Français |
| La magie des additions (jusqu'à 1000) | Maths |
| Qui fait quoi ? (sujet/verbe) | Français |
| Les formes géométriques et périmètres | Maths |
| La Terre et ses merveilles (photosynthèse) | Sciences |

### 🚀 Aaron (PS → MS, 3-4 ans)
| Session | Matière |
|---------|---------|
| Les couleurs de l'arc-en-ciel | Découverte |
| Les chiffres font la fête ! (1→5) | Maths |
| Les animaux et leurs maisons | Découverte du monde |
| Les formes partout | Maths |
| Les saisons défilent | Découverte du monde |

## Déploiement sur GitHub Pages

### Étape 1 — Créer un dépôt GitHub
1. Va sur [github.com](https://github.com) → New Repository
2. Nomme-le `vacances-maya-aaron` (ou ce que tu veux)
3. Mets-le en **Public**

### Étape 2 — Uploader les fichiers
```bash
git init
git add .
git commit -m "Initial commit - Les Vacances de Maya et Aaron"
git remote add origin https://github.com/TON_USERNAME/vacances-maya-aaron.git
git push -u origin main
```

### Étape 3 — Activer GitHub Pages
1. Dans le dépôt → **Settings** → **Pages**
2. Source : **Deploy from a branch**
3. Branch : `main` / `/ (root)`
4. Clique **Save**

### Étape 4 — Accéder à l'app
Ton URL sera : `https://TON_USERNAME.github.io/vacances-maya-aaron/`

> ⚠️ Si tu utilises un sous-dossier (ex: `/vacances-maya-aaron/`), pense à adapter le `start_url` dans `manifest.json` et les chemins du service worker.

## Fonctionnalités

- ✅ Installable sur mobile (Android + iOS)
- ✅ Fonctionne hors ligne après la première visite
- ✅ Progression sauvegardée localement
- ✅ Système d'étoiles et de validation
- ✅ Responsive mobile-first

## Structure

```
├── index.html          ← Page principale
├── manifest.json       ← Config PWA
├── sw.js               ← Service Worker (offline)
├── assets/
│   ├── css/main.css    ← Styles
│   ├── js/
│   │   ├── app.js      ← Logique principale
│   │   └── progress.js ← Sauvegarde progression
│   └── icons/          ← Icônes PWA
└── data/
    └── content.json    ← Contenu pédagogique
```
