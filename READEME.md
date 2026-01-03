# 🏎️ La Forêt Performance - Site Officiel

Site vitrine pour le crew LFP avec animations lourdes et motion design.

## 🚀 Installation

```bash
# 1. Crée le projet Next.js
npx create-next-app@latest lfp-site --typescript --tailwind --app

# 2. Entre dans le dossier
cd lfp-site

# 3. Installe les dépendances animations
npm install gsap locomotive-scroll framer-motion react-intersection-observer
```

## 📁 Structure des fichiers

Remplace les fichiers suivants dans ton projet :

```
lfp-site/
├── app/
│   ├── layout.tsx          (utilise lfp-layout.tsx)
│   ├── page.tsx            (utilise lfp-page.tsx)
│   └── globals.css         (utilise lfp-globals.css)
├── components/
│   ├── Hero.tsx            (utilise lfp-Hero.tsx)
│   ├── Crew.tsx            (utilise lfp-Crew.tsx)
│   ├── Garage.tsx          (utilise lfp-Garage.tsx)
│   └── Footer.tsx          (utilise lfp-Footer.tsx)
├── tailwind.config.ts      (utilise lfp-tailwind.config.ts)
├── next.config.ts          (utilise lfp-next.config.ts)
└── package.json            (utilise lfp-package.json)
```

## 🎨 Personnalisation

### 1. Images et logos
Remplace les placeholders :
- Hero background : ligne 33 dans `Hero.tsx`
- Logo LFP : lignes 50-55 dans `Hero.tsx` (SVG à remplacer)
- Photos crew : dans `Crew.tsx` tableau `crewMembers`
- Photos voitures : dans `Garage.tsx` tableau `cars`

### 2. Contenu
Édite les tableaux dans les composants :
- **Crew.tsx** : Ajoute/modifie les membres
- **Garage.tsx** : Ajoute/modifie les voitures et specs

### 3. Couleurs
Dans `tailwind.config.ts` :
```typescript
'lfp-dark': '#0a0a0a',    // Fond principal
'lfp-green': '#2d5016',   // Vert forêt
'lfp-accent': '#ff4d00',  // Orange accent
```

## 🏃 Lancement

```bash
# Mode développement
npm run dev

# Ouvre http://localhost:3000
```

## 🚀 Déploiement Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Pour un domaine custom (après premier deploy)
vercel --prod
```

Ou via dashboard Vercel :
1. Connecte ton GitHub
2. Import le repo
3. Deploy automatique

## ✨ Animations incluses

- ✅ Logo SVG stroke animation au chargement
- ✅ Parallax hero sur scroll
- ✅ Scroll indicator animé
- ✅ Cards crew avec reveal au hover
- ✅ Cards garage avec jantes qui tournent
- ✅ Modal specs voiture
- ✅ Scroll-triggered animations
- ✅ Smooth transitions Framer Motion

## 🎯 Features à ajouter (optionnel)

- [ ] Vidéo background au lieu d'image
- [ ] Section "Meets" avec galerie photos
- [ ] Formulaire contact
- [ ] Particles.js fumée d'échappement
- [ ] Son moteur au hover des voitures
- [ ] Three.js pour logo 3D

## 📝 Notes

- Images actuelles = placeholders Unsplash
- Remplace par vraies photos HD depuis Instagram
- Logo LFP = SVG simplifié à remplacer
- Adapte les noms des membres

## 🐛 Troubleshooting

**Erreur GSAP :**
```bash
npm install gsap@latest
```

**Erreur Locomotive Scroll :**
```bash
npm install locomotive-scroll@beta
```

**Images ne chargent pas :**
Vérifie `next.config.ts` domains

---

Made with 🔥 by [ton nom]