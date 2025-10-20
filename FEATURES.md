# Nouvelles Fonctionnalités - Octobre 2025

## 📌 Vue d'ensemble

Ce document décrit les deux nouvelles fonctionnalités majeures ajoutées au portail de suivi des devoirs.

---

## ⭐ Fonctionnalité 1: Élève de la Semaine par Classe

### Description
Le système affiche maintenant un élève de la semaine pour **chaque classe** sur la page d'accueil. Chaque élève est sélectionné en fonction de ses performances et est affiché avec sa photo, son nombre d'étoiles et sa classe.

### Critères de Sélection

#### 1. Calcul des Étoiles (Pondération: 70%)
Un élève peut gagner jusqu'à 5 étoiles par semaine (une par jour, du dimanche au jeudi).

**Critères pour gagner une étoile quotidienne:**
- Taux de complétion des devoirs > 70%
- Moyenne de participation > 5/10
- Moyenne de comportement > 5/10

#### 2. Progression Globale (Pondération: 30%)
Le pourcentage de progression est calculé sur la semaine:

```
Score Total = Σ (status_devoir + participation + comportement)
Score Maximum = nombre_devoirs × 30
Progression (%) = (Score Total / Score Maximum) × 100
```

**Valeurs des statuts:**
- Fait: 10 points
- Partiellement Fait: 5 points
- Non Fait: 0 point
- Absent: exclu du calcul

#### 3. Score Combiné Final
```
Score Combiné = (étoiles × 20) + (progression × 0.3)
```

L'élève avec le score combiné le plus élevé dans chaque classe devient l'élève de la semaine.

### Affichage

#### Page d'Accueil
```
┌─────────────────────────────────────────────┐
│      ⭐ Élève de la semaine ⭐              │
├─────────────┬─────────────┬─────────────────┤
│   [Photo]   │   [Photo]   │    [Photo]      │
│   Ahmed     │   Bilal     │    Mohamed      │
│  ★★★★★      │  ★★★★☆      │   ★★★★★         │
│   PEI2      │   PEI1      │    PEI3         │
└─────────────┴─────────────┴─────────────────┘
```

#### Éléments Visuels
- **Photo**: Circulaire, bordure jaune étoile
- **Nom**: En gras, couleur primaire
- **Étoiles**: Affichage visuel des 5 étoiles (remplies ou vides)
- **Classe**: Badge coloré avec nom de la classe

### Comportement Technique

#### Persistance des Données
- Les élèves de la semaine sont calculés une fois par semaine
- Les résultats sont stockés dans MongoDB (`students_of_the_week`)
- Identifiant de semaine: Format `YYYY-[W]WW` (ex: "2025-W42")
- Les données persistent du dimanche au jeudi

#### Recalcul Automatique
Le système recalcule automatiquement les élèves de la semaine:
- Chaque dimanche (début de nouvelle semaine scolaire)
- Si aucune donnée n'existe pour la semaine en cours

#### API Endpoint
```
GET /api/weekly-summary

Réponse:
{
  "studentsOfWeek": [
    {
      "name": "Ahmed",
      "class": "PEI2",
      "stars": 5,
      "progressPercentage": 87,
      "weekIdentifier": "2025-W42",
      "startDate": "2025-10-13",
      "endDate": "2025-10-17",
      "createdAt": "2025-10-20T10:30:00.000Z"
    },
    ...
  ]
}
```

### Responsive Design
L'affichage s'adapte automatiquement:
- **Desktop (>1200px)**: 4 colonnes
- **Tablette (768px-1200px)**: 2-3 colonnes
- **Mobile (<768px)**: 1 colonne

---

## 🗑️ Fonctionnalité 2: Suppression Automatique des Photos

### Description
Les photos de félicitations sont maintenant automatiquement supprimées après **3 jours** d'affichage, permettant de garder le contenu frais et pertinent.

### Photos Concernées
1. **Photo du Jour** (`/api/photo-of-the-day`)
2. **Photo de Célébration 2** (`/api/photo-2`)
3. **Photo de Célébration 3** (`/api/photo-3`)

### Fonctionnement

#### Mécanisme de Suppression
```javascript
// Lors de chaque requête GET
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

// Suppression des photos anciennes
await collection.deleteMany({ 
  createdAt: { $lt: threeDaysAgo } 
});
```

#### Timeline d'une Photo
```
Jour 0 (Ajout)        Jour 1           Jour 2           Jour 3+
     |                  |                |                 |
     v                  v                v                 v
[📸 Ajoutée]  →   [✓ Affichée]  →  [✓ Affichée]  →  [🗑️ Supprimée]
```

### Avantages

#### 1. Automatisation
- Pas besoin d'intervention manuelle
- Suppression en arrière-plan lors des requêtes

#### 2. Performance
- Base de données allégée
- Pas de photos obsolètes

#### 3. Contenu Actuel
- Affichage uniquement des événements récents
- Encourage l'ajout régulier de nouvelles photos

### Comportement Technique

#### Collections MongoDB
- `photos_of_the_day`
- `photos_celebration_2`
- `photos_celebration_3`

#### Champ Requis
```javascript
{
  url: "https://lh3.googleusercontent.com/d/...",
  comment: "Félicitations!",
  createdAt: ISODate("2025-10-20T10:30:00Z") // Obligatoire
}
```

#### Timing de Suppression
- Déclenchée à chaque requête GET
- Pas de cron job nécessaire
- Efficace et simple

---

## 🔄 Compatibilité

### Rétrocompatibilité
- ✅ Toutes les fonctionnalités existantes préservées
- ✅ Pas de changements dans les API existantes
- ✅ Design et paramètres conservés
- ✅ Aucune migration de données requise

### Dépendances
- MongoDB 6.5.0+
- Moment.js 2.29.4+
- Node.js (pour les fonctions serverless)

---

## 📱 Support Multilingue

Les nouvelles fonctionnalités supportent:
- **Français** (par défaut)
- **Arabe** (RTL)

### Traductions
```javascript
translations = {
  fr: {
    sotwTitle: "⭐ Élève de la semaine ⭐",
    ...
  },
  ar: {
    sotwTitle: "⭐ تلميذ الأسبوع ⭐",
    ...
  }
}
```

---

## 🎨 Styles CSS

### Nouvelles Classes

#### `.sotw-info`
Conteneur pour chaque carte d'élève
```css
.sotw-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}
```

#### `.sotw-stars`
Affichage des étoiles
```css
.sotw-stars {
    font-size: 1.5rem;
    color: var(--yellow-star);
}
```

#### `.sotw-class`
Badge de classe
```css
.sotw-class {
    font-size: 1rem;
    color: var(--secondary-color);
    font-weight: 600;
    background: white;
    padding: 4px 12px;
    border-radius: 15px;
}
```

---

## 🔧 Configuration

### Variables d'Environnement
```env
MONGODB_URI=mongodb+srv://...
```

### Paramètres Configurables

#### Délai de Suppression des Photos
Actuellement fixé à **3 jours**, modifiable dans:
- `api/photo-of-the-day.js`
- `api/photo-2.js`
- `api/photo-3.js`

```javascript
// Pour changer le délai (ex: 5 jours)
threeDaysAgo.setDate(threeDaysAgo.getDate() - 5);
```

#### Poids de l'Algorithme de Sélection
Actuellement:
- Étoiles: 70% (`stars × 20`)
- Progression: 30% (`progress × 0.3`)

Modifiable dans `api/weekly-summary.js`:
```javascript
const combinedScore = (stars * 20) + (progress * 0.3);
```

---

## 📊 Monitoring

### Métriques à Surveiller

#### Base de Données
- Taille de la collection `students_of_the_week`
- Nombre de photos dans les collections de célébration
- Temps de réponse de `/api/weekly-summary`

#### Performance
- Temps de chargement de la page d'accueil
- Temps de réponse des APIs
- Utilisation mémoire MongoDB

### Logs
Les erreurs sont loguées avec le préfixe:
- `[weekly-summary] ERREUR:`
- `[photo-of-the-day] ERREUR:`
- `[photo-2] ERREUR:`
- `[photo-3] ERREUR:`

---

## 🚀 Déploiement

### Étapes de Déploiement
1. Merger la pull request dans `main`
2. Vercel déploie automatiquement
3. Vérifier que `MONGODB_URI` est configuré dans Vercel
4. Tester la page d'accueil

### Rollback
En cas de problème:
1. Revenir au commit précédent
2. Force push sur `main`
3. Vercel redéploie automatiquement

---

## 📞 Support

### Questions Fréquentes

**Q: Pourquoi aucun élève de la semaine n'apparaît?**
R: Il faut des évaluations pour la semaine en cours. Le système calcule à partir des données disponibles.

**Q: Comment modifier le délai de suppression des photos?**
R: Modifier la valeur dans les fichiers API (voir section Configuration).

**Q: L'algorithme favorise-t-il les étoiles ou la progression?**
R: Les étoiles ont un poids de 70% et la progression 30%.

**Q: Peut-on avoir plusieurs élèves de la même classe?**
R: Non, un seul élève par classe est sélectionné (le meilleur).

---

## 📝 Changelog

### Version 2.0.0 (Octobre 2025)
- ✨ Ajout: Élève de la semaine par classe
- ✨ Ajout: Suppression automatique des photos après 3 jours
- 🔧 Modification: API `/api/weekly-summary` refactorisée
- 🎨 Ajout: Nouveaux styles CSS pour affichage multi-élèves
- 📊 Ajout: Collection MongoDB `students_of_the_week`

---

## 🙏 Crédits

Développé pour améliorer l'expérience utilisateur du portail de suivi des devoirs.

**Fonctionnalités développées par:** GenSpark AI Developer
**Date:** Octobre 2025
**Repository:** https://github.com/medch24/Devoirs2026
