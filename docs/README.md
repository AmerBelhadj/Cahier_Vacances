# 🦋🚀 Les Vacances de Maya et Aaron

**Cahier de vacances interactif — Progressive Web App (PWA)**

Une application web installable sur mobile, tablette et ordinateur, qui fonctionne **hors ligne** une fois ouverte la première fois.

---

## 👨‍👩‍👧 Pour les parents — Comment ça marche

L'application est organisée en 4 niveaux simples :

```
🏠 Accueil
 └─ 🦋 Maya  /  🚀 Aaron
     └─ 📚 Matière (Français, Maths, Sciences…)
         └─ 3 étapes par matière :
             🔄 RÉVISION    → on revoit l'année qui se termine
             🌉 PRÉPARATION → on prépare la transition en douceur
             🚀 ÉTUDE       → on découvre le programme de l'an prochain
```

Chaque étape contient :
- un **cours** (pour Préparation et Étude),
- au moins **10 exercices** avec, après la réponse de l'enfant : la **bonne réponse**, une **explication**, et une **référence au cours**,
- au moins **10 jeux** pédagogiques à faire ensemble.

### 📌 Important pour Aaron (3-4 ans, maternelle)
Aaron ne sait pas encore lire. Toutes ses activités commencent par 👨‍👩‍👧 : ce sont des **consignes destinées au parent** qui anime l'activité à l'oral, par le jeu et la manipulation. La « réponse » décrit ce que l'enfant doit réussir, et l'explication donne un conseil pédagogique.

---

## 📖 Contenu pédagogique

### 🦋 Maya — CE1 → CE2 (Cycle 2)
| Matière | Révision | Préparation | Étude |
|---------|:--------:|:-----------:|:-----:|
| 🔠 Français | ✓ | ✓ | ✓ |
| 🔢 Mathématiques | ✓ | ✓ | ✓ |
| 🌍 Questionner le monde | ✓ | ✓ | ✓ |
| 🤝 Enseignement moral et civique | ✓ | ✓ | ✓ |
| 🎨 Arts plastiques | ✓ | ✓ | ✓ |

### 🚀 Aaron — PS → MS (Maternelle)
| Domaine | Révision | Préparation | Étude |
|---------|:--------:|:-----------:|:-----:|
| 🗣️ Le Langage | ✓ | ✓ | ✓ |
| 🔢 Les Mathématiques | ✓ | ✓ | ✓ |
| 🌍 Explorer le Monde | ✓ | ✓ | ✓ |
| 🤸 Bouger & le Sport | ✓ | ✓ | ✓ |
| 🎨 Dessin & Musique | ✓ | ✓ | ✓ |

**Total : 306 exercices + 300 jeux**, conformes aux programmes officiels de l'Éducation nationale française.

---

## 🚀 Mettre en ligne sur GitHub Pages (gratuit)

### Étape 1 — Créer un dépôt
1. Va sur [github.com](https://github.com) → **New repository**
2. Nomme-le par exemple `vacances-maya-aaron`
3. Mets-le en **Public** → **Create repository**

### Étape 2 — Envoyer les fichiers
**Option simple (sans ligne de commande) :** sur la page du dépôt, clique **« uploading an existing file »**, glisse-dépose **tout le contenu** du dossier `maya-aaron-vacances/` (pas le dossier lui-même, mais ce qu'il contient : `index.html`, `manifest.json`, `sw.js`, et les dossiers `assets/` et `data/`), puis **Commit changes**.

**Option ligne de commande :**
```bash
cd maya-aaron-vacances
git init
git add .
git commit -m "Les Vacances de Maya et Aaron"
git branch -M main
git remote add origin https://github.com/TON_PSEUDO/vacances-maya-aaron.git
git push -u origin main
```

### Étape 3 — Activer GitHub Pages
1. Dans le dépôt → **Settings** → **Pages**
2. **Source** : *Deploy from a branch*
3. **Branch** : `main` et dossier `/ (root)` → **Save**
4. Attends 1-2 minutes.

### Étape 4 — Ouvrir l'app
L'adresse sera :
```
https://TON_PSEUDO.github.io/vacances-maya-aaron/
```
Ouvre-la sur le téléphone, puis **« Ajouter à l'écran d'accueil »** pour l'installer comme une vraie application. 🎉

> ⚠️ Comme tous les chemins du projet sont **relatifs** (`./`), l'app fonctionne directement dans un sous-dossier GitHub Pages, sans rien modifier.

---

## 💾 Fonctionnalités techniques
- ✅ **Installable** (Android, iOS, ordinateur)
- ✅ **Fonctionne hors ligne** après la première visite (service worker, cache-first)
- ✅ **Progression sauvegardée** localement (étoiles par étape terminée)
- ✅ **Responsive** mobile-first, gros boutons adaptés aux enfants
- ✅ **Aucune donnée envoyée** : tout reste sur l'appareil, aucun compte requis

---

## 📂 Structure du projet
```
maya-aaron-vacances/
├── index.html              ← page unique de l'application
├── manifest.json           ← configuration PWA (nom, icônes, couleurs)
├── sw.js                   ← service worker (mode hors ligne)
├── assets/
│   ├── css/main.css        ← styles (thème rose Maya / turquoise Aaron)
│   ├── js/
│   │   ├── app.js          ← logique et navigation
│   │   └── progress.js     ← sauvegarde de la progression
│   └── icons/              ← icônes 192 et 512 px
├── data/
│   └── content.json        ← tout le contenu pédagogique
└── docs/
    └── README.md           ← ce guide
```

## 🔄 Mettre à jour le contenu
Tout le contenu est dans `data/content.json`. Pour ajouter ou modifier un exercice, édite ce fichier puis incrémente le numéro de version dans `sw.js` (ligne `CACHE_NAME`) pour forcer le rafraîchissement du cache.

---

*Bon travail et bonnes vacances à Maya et Aaron ! 🦋🚀*
