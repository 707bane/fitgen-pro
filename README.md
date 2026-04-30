# 🏋️ FitGen Pro — Générateur de Programme d'Entraînement

Application web permettant de générer un programme d'entraînement sportif personnalisé sur 4 semaines, basé sur le profil, l'objectif et les disponibilités de l'utilisateur.

## ✨ Fonctionnalités

- **Formulaire de profil** — prénom, âge, poids, taille, objectif, niveau, équipement, durée par séance
- **Sélection des jours d'entraînement** — choix libre parmi les 7 jours de la semaine
- **Calcul de l'IMC** — affiché automatiquement avec interprétation
- **Génération de programme sur 4 semaines** — séances détaillées avec exercices, séries, répétitions et temps de repos
- **Algorithme de recommandation** — adapte le split et les exercices selon l'objectif et le niveau
- **Conseils hebdomadaires** — progression, intensification, décharge
- **Export PDF** — impression du programme via le navigateur

## 🧠 Algorithme de génération

Le programme est généré selon des principes d'entraînement reconnus :

| Objectif | Split | Séries × Reps | Repos |
|---|---|---|---|
| Perte de poids | Full body + Cardio | 3 × 15-20 | 45s |
| Prise de masse | Push / Pull / Legs | 4 × 8-12 | 90s |
| Endurance | Cardio + Fractionné | 5 × 45s effort | — |
| Remise en forme | Renfo + Cardio + Mobilité | 3 × 12-15 | 60s |
| Force | Squat / Développé / Deadlift | 5 × 3-6 | 3-5min |

## 🏗️ Structure du projet

```
fitgen-pro/
├── index.html    # Structure HTML de l'application
├── style.css     # Design et mise en page (dark theme)
└── script.js     # Logique de génération des programmes
```

## ▶️ Lancement

Aucune installation requise. Ouvre simplement `index.html` dans un navigateur.

## 🛠️ Technologies

- **HTML5** — structure sémantique
- **CSS3** — variables CSS, animations, responsive design
- **JavaScript Vanilla** — logique de génération, manipulation du DOM
- **Google Fonts** — Bebas Neue, DM Sans, DM Mono

## 👤 Auteur

Esteban Encinas — Étudiant en Bachelor DSNS à ESIEE-IT  
Projet réalisé dans le cadre du Programme Engagement Étudiant ESIEE-IT 2025-2026.

## 📄 Licence

MIT License — libre d'utilisation et de modification.
