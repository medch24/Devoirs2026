# 📚 Portail de Suivi des Devoirs - Devoirs2026

Application web de gestion et suivi des devoirs scolaires avec système de récompenses et de reconnaissance des élèves.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/medch24/Devoirs2026)

## 🌟 Fonctionnalités Principales

### Pour les Parents
- 👨‍👩‍👧‍👦 Consultation des devoirs de leurs enfants
- 📊 Suivi de la progression hebdomadaire
- ⭐ Visualisation du système d'étoiles
- 📈 Graphiques de performance (participation, comportement)
- 🏆 Badge "Élève de la semaine"

### Pour les Enseignants
- 📝 Évaluation des devoirs par matière
- 👥 Suivi de plusieurs classes
- 📅 Organisation par semaines
- 💬 Ajout de commentaires personnalisés
- 🎯 Évaluation de la participation et du comportement

### Pour les Administrateurs
- 📤 Upload du planning via fichier Excel
- 🖼️ Gestion des photos de félicitations (3 slots)
- 🏆 Affichage automatique de l'élève de la semaine par classe
- 🗑️ Suppression automatique des anciennes photos (3 jours)

## ⭐ Nouvelles Fonctionnalités (Octobre 2025)

### 1. Élève de la Semaine par Classe
- Affichage d'un élève de la semaine pour chaque classe
- Sélection basée sur un algorithme combinant étoiles (70%) et progression (30%)
- Photos des élèves avec nombre d'étoiles visuel
- Persistance des données toute la semaine
- Recalcul automatique chaque début de semaine

### 2. Auto-suppression des Photos de Félicitations
- Suppression automatique après 3 jours
- Appliqué à toutes les photos de célébration
- Maintenance automatique sans intervention manuelle

📖 **Documentation détaillée** : Voir [FEATURES.md](./FEATURES.md)

## 🏗️ Architecture Technique

### Stack Technologique
- **Frontend** : HTML5, CSS3, JavaScript vanilla
- **Backend** : Node.js avec fonctions serverless
- **Base de données** : MongoDB Atlas
- **Déploiement** : Vercel
- **Bibliothèques** :
  - Moment.js pour la gestion des dates
  - XLSX.js pour l'import Excel

### Structure du Projet
```
devoirs2026/
├── api/                      # Fonctions serverless (backend)
│   ├── evaluations.js        # Gestion des évaluations
│   ├── weekly-summary.js     # Élève de la semaine
│   ├── photo-of-the-day.js   # Photos de félicitations
│   ├── photo-2.js
│   ├── photo-3.js
│   ├── daily-stars.js        # Système d'étoiles
│   ├── initial-data.js       # Données initiales
│   └── upload-plan.js        # Upload du planning
├── public/                   # Frontend (statique)
│   ├── index.html            # Page principale
│   ├── index.js              # Logique frontend
│   └── styles.css            # Styles
├── vercel.json               # Configuration Vercel
├── package.json              # Dépendances
└── .gitignore               # Fichiers exclus

Documentation/
├── FEATURES.md              # Documentation des fonctionnalités
├── TEST_GUIDE.md           # Guide de test
├── DEPLOYMENT_FIX.md       # Guide de déploiement
├── PR_SUMMARY.md           # Résumé technique
└── CREATE_PR.md            # Instructions PR
```

## 🚀 Installation et Déploiement

### Prérequis
- Node.js 18.x ou supérieur
- Compte MongoDB Atlas
- Compte Vercel (optionnel pour déploiement)

### Installation Locale

1. **Cloner le repository**
```bash
git clone https://github.com/medch24/Devoirs2026.git
cd Devoirs2026
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
Créer un fichier `.env` à la racine :
```env
MONGODB_URI=mongodb+srv://votre-username:votre-password@cluster.mongodb.net/test
```

4. **Développement local avec Vercel CLI**
```bash
npm install -g vercel
vercel dev
```

L'application sera disponible sur `http://localhost:3000`

### Déploiement sur Vercel

#### Méthode 1 : Via GitHub (Recommandé)
1. Fork ou push le repository sur GitHub
2. Connecter le repository à Vercel
3. Configurer la variable `MONGODB_URI` dans Vercel Dashboard
4. Vercel déploie automatiquement

#### Méthode 2 : Via Vercel CLI
```bash
vercel
```

Suivre les instructions pour configurer le projet.

**Important** : Configurer `MONGODB_URI` dans Vercel Dashboard :
Settings → Environment Variables → Add

📖 **Guide complet** : Voir [DEPLOYMENT_FIX.md](./DEPLOYMENT_FIX.md)

## 🗄️ Base de Données MongoDB

### Collections Utilisées

1. **plans** : Planning des devoirs
   - Structure : `{ Enseignant, Jour, Classe, Matière, Devoirs }`

2. **evaluations** : Évaluations des élèves
   - Structure : `{ studentName, class, date, subject, status, participation, behavior, comment }`

3. **daily_stars** : Étoiles quotidiennes
   - Structure : `{ studentName, className, date, earnedStar }`

4. **students_of_the_week** : Élèves de la semaine ⭐ NEW
   - Structure : `{ name, class, stars, progressPercentage, weekIdentifier, startDate, endDate }`

5. **photos_of_the_day** : Photos de félicitations
   - Structure : `{ url, comment, createdAt }`

6. **photos_celebration_2** & **photos_celebration_3** : Photos additionnelles

### Indexes Recommandés
```javascript
// evaluations
db.evaluations.createIndex({ studentName: 1, class: 1, date: 1 })
db.evaluations.createIndex({ class: 1, date: 1, subject: 1 })

// students_of_the_week
db.students_of_the_week.createIndex({ weekIdentifier: 1 })

// photos
db.photos_of_the_day.createIndex({ createdAt: 1 })
```

## 🔐 Authentification

### Comptes par Défaut

**Administrateur** (accès complet) :
- Username : `Mohamed86`
- Password : `Mohamed86`

**Enseignant** (accès limité) :
- Username : `Alkawthar@!!!`
- Password : `Alkawthar@!!!`

**⚠️ Important** : Changer ces mots de passe en production !

## 🧪 Tests

### Tests Manuels
Voir le guide complet : [TEST_GUIDE.md](./TEST_GUIDE.md)

### Tests Rapides

1. **Test Frontend**
```bash
# Ouvrir dans le navigateur
open http://localhost:3000
```

2. **Test API**
```bash
# Test weekly summary
curl http://localhost:3000/api/weekly-summary

# Test evaluations
curl "http://localhost:3000/api/evaluations?class=PEI1&date=2025-10-20"
```

3. **Vérifier la Console**
Ouvrir DevTools (F12) et vérifier qu'il n'y a pas d'erreurs.

## 🌍 Support Multilingue

L'application supporte :
- 🇫🇷 **Français** (par défaut)
- 🇸🇦 **Arabe** (avec support RTL)

Changement de langue via les boutons en haut à droite de l'écran d'accueil.

## 📱 Responsive Design

L'application est entièrement responsive :
- 💻 **Desktop** : Affichage complet avec grilles multi-colonnes
- 📱 **Tablette** : Adaptation automatique 2-3 colonnes
- 📱 **Mobile** : Layout en colonne unique optimisé

## 🔧 Configuration

### Personnalisation du Délai de Suppression des Photos

Dans `api/photo-of-the-day.js` (et photo-2, photo-3) :
```javascript
// Changer de 3 à 5 jours par exemple
const daysAgo = new Date();
daysAgo.setDate(daysAgo.getDate() - 5); // Au lieu de 3
```

### Personnalisation de l'Algorithme de Sélection

Dans `api/weekly-summary.js` :
```javascript
// Modifier les poids (actuellement 70/30)
const combinedScore = (stars * 20) + (progress * 0.3);

// Exemple 50/50 :
const combinedScore = (stars * 10) + (progress * 0.5);
```

## 📊 Monitoring

### Métriques Importantes
- Temps de réponse des APIs (< 1s recommandé)
- Taux d'erreur (< 1%)
- Utilisation de la base de données
- Temps de chargement de la page (< 2s)

### Logs
Les erreurs sont loguées avec préfixes :
- `[weekly-summary] ERREUR:`
- `[evaluations] ERREUR:`
- `[photo-of-the-day] ERREUR:`

Vérifier les logs dans Vercel Dashboard → Deployments → Logs

## 🤝 Contribution

### Workflow Git
1. Créer une branche : `git checkout -b feature/nom-feature`
2. Faire les modifications
3. Commiter : `git commit -m "feat: description"`
4. Push : `git push origin feature/nom-feature`
5. Créer une Pull Request sur GitHub

### Convention de Commits
Utiliser [Conventional Commits](https://www.conventionalcommits.org/) :
- `feat:` pour les nouvelles fonctionnalités
- `fix:` pour les corrections de bugs
- `docs:` pour la documentation
- `style:` pour les changements de style
- `refactor:` pour les refactorisations
- `test:` pour les tests
- `chore:` pour les tâches de maintenance

## 📄 License

Ce projet est privé et propriétaire.

## 👥 Auteurs

- **Développement initial** : medch24
- **Nouvelles fonctionnalités (Oct 2025)** : GenSpark AI Developer

## 📞 Support

Pour toute question ou problème :
1. Consulter la documentation dans `/docs`
2. Vérifier les issues GitHub
3. Créer une nouvelle issue si nécessaire

## 🗺️ Roadmap

### Améliorations Prévues
- [ ] Dashboard statistiques pour les administrateurs
- [ ] Système de notifications par email
- [ ] Export PDF des rapports d'évaluation
- [ ] Application mobile (React Native)
- [ ] API publique documentée
- [ ] Tests automatisés (Jest)
- [ ] Mode hors-ligne (PWA)

## 📚 Documentation Complète

- [FEATURES.md](./FEATURES.md) - Documentation des fonctionnalités
- [TEST_GUIDE.md](./TEST_GUIDE.md) - Guide de test complet
- [DEPLOYMENT_FIX.md](./DEPLOYMENT_FIX.md) - Guide de déploiement
- [PR_SUMMARY.md](./PR_SUMMARY.md) - Détails techniques des changements
- [CREATE_PR.md](./CREATE_PR.md) - Instructions pour les Pull Requests

---

**Développé avec ❤️ pour faciliter le suivi scolaire**

*Dernière mise à jour : Octobre 2025*
