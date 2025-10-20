# Guide de Test - Nouvelles Fonctionnalités

## 🎯 Fonctionnalités à Tester

### 1. Élève de la Semaine par Classe

#### Scénario 1: Affichage Initial
1. Ouvrir la page d'accueil
2. Vérifier que la section "⭐ Élève de la semaine ⭐" s'affiche
3. Vérifier qu'il y a plusieurs élèves affichés (un par classe)
4. Vérifier que chaque carte affiche:
   - Photo de l'élève (circulaire avec bordure jaune)
   - Nom de l'élève
   - Étoiles (5 étoiles, certaines remplies)
   - Nom de la classe

#### Scénario 2: Calcul Basé sur Performance
Pour tester le calcul, vérifier dans la console MongoDB:
```javascript
// Se connecter à MongoDB
db.students_of_the_week.find()

// Vérifier les données
// Chaque document devrait avoir:
// - name: nom de l'élève
// - class: classe (PEI1, PEI2, etc.)
// - stars: nombre d'étoiles (0-5)
// - progressPercentage: pourcentage (0-100)
// - weekIdentifier: ex: "2025-W42"
```

#### Scénario 3: Persistance Hebdomadaire
1. Recharger la page plusieurs fois
2. Vérifier que les mêmes élèves restent affichés
3. Attendre le début d'une nouvelle semaine (dimanche)
4. Vérifier que les élèves sont recalculés

#### Scénario 4: Responsive Design
1. Redimensionner la fenêtre du navigateur
2. Vérifier que les cartes s'adaptent:
   - Desktop: 3-4 cartes par ligne
   - Tablette: 2 cartes par ligne
   - Mobile: 1 carte par ligne

### 2. Suppression Automatique des Photos

#### Scénario 1: Ajout d'une Photo
1. Se connecter en tant qu'admin (Mohamed86 / Mohamed86)
2. Aller dans l'espace enseignant
3. Ajouter une photo de félicitations:
   - Coller un lien d'image Google Drive
   - Ajouter un commentaire (optionnel)
   - Cliquer sur "Enregistrer"
4. Revenir à la page d'accueil
5. Vérifier que la photo s'affiche

#### Scénario 2: Vérification de la Date
Dans MongoDB, vérifier la date de création:
```javascript
db.photos_of_the_day.find().sort({createdAt: -1}).limit(1)
// Devrait afficher la photo avec sa date de création
```

#### Scénario 3: Suppression Automatique
Méthode 1 - Simulation:
```javascript
// Dans MongoDB, créer une photo avec une date ancienne
db.photos_of_the_day.insertOne({
    url: "https://lh3.googleusercontent.com/d/EXEMPLE",
    comment: "Test photo ancienne",
    createdAt: new Date("2025-10-15") // Il y a plus de 3 jours
})

// Recharger la page d'accueil
// La photo ancienne devrait être supprimée automatiquement
```

Méthode 2 - Attente réelle:
1. Ajouter une photo
2. Attendre 3 jours
3. Recharger la page
4. Vérifier que la photo a disparu

#### Scénario 4: Plusieurs Photos
1. Ajouter Photo 1 (photo-of-the-day)
2. Ajouter Photo 2 (photo-2)
3. Ajouter Photo 3 (photo-3)
4. Vérifier que toutes s'affichent sur la page d'accueil
5. Créer des photos anciennes pour chacune
6. Vérifier que toutes sont supprimées après 3 jours

## 🔍 Points de Vérification Détaillés

### A. Base de Données

#### Collection: students_of_the_week
```javascript
// Structure attendue
{
    name: "Ahmed",
    class: "PEI2",
    stars: 5,
    progressPercentage: 87,
    weekIdentifier: "2025-W42",
    startDate: "2025-10-13",
    endDate: "2025-10-17",
    createdAt: ISODate("2025-10-20T10:30:00Z")
}
```

#### Collections de Photos
```javascript
// Structure attendue (photos_of_the_day, photos_celebration_2, photos_celebration_3)
{
    url: "https://lh3.googleusercontent.com/d/...",
    comment: "Félicitations pour le projet!",
    createdAt: ISODate("2025-10-20T10:30:00Z")
}
```

### B. Interface Utilisateur

#### Section Élève de la Semaine
- [ ] Titre visible: "⭐ Élève de la semaine ⭐"
- [ ] Multiple cartes élèves visibles
- [ ] Photos circulaires avec bordure jaune
- [ ] Noms des élèves affichés
- [ ] Étoiles affichées (0-5, visuelles)
- [ ] Classes affichées dans des badges

#### Section Photos de Félicitations
- [ ] Photo 1 s'affiche si présente
- [ ] Photo 2 s'affiche si présente
- [ ] Photo 3 s'affiche si présente
- [ ] Commentaires s'affichent correctement
- [ ] Photos anciennes (>3 jours) n'apparaissent pas

### C. Algorithme de Sélection

Test de l'algorithme:
```javascript
// Exemple de calcul
const student = {
    stars: 4,              // 4 étoiles
    progressPercentage: 75  // 75% de progression
};

const combinedScore = (student.stars * 20) + (student.progressPercentage * 0.3);
// combinedScore = (4 * 20) + (75 * 0.3) = 80 + 22.5 = 102.5

// L'élève avec le score le plus élevé dans chaque classe est sélectionné
```

## 🐛 Problèmes Potentiels et Solutions

### Problème 1: Aucun élève de la semaine affiché
**Causes possibles:**
- Pas assez de données d'évaluation
- Semaine sans évaluations
- Erreur de connexion MongoDB

**Vérifications:**
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs JavaScript
3. Vérifier la réponse de l'API: `/api/weekly-summary`

**Solution:**
- S'assurer que des évaluations existent pour la semaine en cours
- Vérifier que `MONGODB_URI` est correctement configuré

### Problème 2: Photos ne se suppriment pas
**Causes possibles:**
- Date système incorrecte
- Erreur MongoDB

**Vérifications:**
1. Vérifier la date système: `new Date()`
2. Vérifier les logs du serveur
3. Tester manuellement la requête de suppression

**Solution:**
```javascript
// Dans MongoDB, vérifier manuellement
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
db.photos_of_the_day.find({ createdAt: { $lt: threeDaysAgo } })
// Devrait lister les photos anciennes
```

### Problème 3: Layout cassé sur mobile
**Causes possibles:**
- CSS non chargé
- Erreur de syntaxe CSS

**Vérifications:**
1. Vérifier que `styles.css` se charge
2. Inspecter l'élément dans les DevTools
3. Vérifier les media queries

## 📊 Métriques de Test

### Performance
- [ ] Page d'accueil se charge en < 2 secondes
- [ ] API `/api/weekly-summary` répond en < 1 seconde
- [ ] Pas de requêtes inutiles à MongoDB

### Compatibilité
- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)
- [ ] Mobile iOS
- [ ] Mobile Android

### Accessibilité
- [ ] Images ont des attributs `alt`
- [ ] Contraste de couleurs suffisant
- [ ] Navigation au clavier possible

## ✅ Checklist Finale

- [ ] Toutes les fonctionnalités existantes fonctionnent
- [ ] Élève de la semaine s'affiche par classe
- [ ] Calcul basé sur étoiles + progression
- [ ] Photos se suppriment après 3 jours
- [ ] Interface responsive
- [ ] Pas d'erreurs en console
- [ ] Code commité et pushé
- [ ] Pull request créée
- [ ] Documentation à jour

## 📞 Support

En cas de problème, vérifier:
1. Logs du serveur Vercel
2. Console du navigateur
3. État de MongoDB
4. Variables d'environnement

Pour les questions techniques:
- Vérifier le code dans `/api` pour le backend
- Vérifier `public/index.js` pour le frontend
- Consulter `PR_SUMMARY.md` pour les détails techniques
