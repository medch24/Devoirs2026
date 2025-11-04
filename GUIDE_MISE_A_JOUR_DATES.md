# 📅 Guide : Mettre à Jour les Dates des Devoirs

## 🔍 Problème Identifié

Votre base de données MongoDB contient des devoirs avec des **dates anciennes** :
- `2025-09-28` (28 septembre 2025)
- `2025-09-30` (30 septembre 2025)

Mais l'application affiche les devoirs de la **semaine actuelle** (novembre 2025).

**Résultat** : Aucun devoir n'est affiché car il n'y en a pas pour la semaine en cours.

---

## ✅ Solutions Disponibles

### Solution 1 : Script Automatique (Recommandé)

J'ai créé un script `update-dates.js` qui :
- ✅ Récupère tous vos devoirs existants
- ✅ Calcule automatiquement les nouvelles dates (semaine actuelle)
- ✅ Met à jour toutes les dates dans MongoDB
- ✅ Préserve tous vos devoirs (enseignants, classes, matières, etc.)

#### Utilisation du Script

**Prérequis** :
- Avoir `MONGODB_URI` configurée localement
- Node.js installé

**Commandes** :

```bash
# 1. Définir la variable d'environnement (remplacer par votre vraie chaîne)
export MONGODB_URI="mongodb+srv://cherifmed2010:Mmedch8G@devoirs.m5p4clw.mongodb.net/devoirs?retryWrites=true&w=majority"

# 2. Exécuter le script
cd /home/user/webapp
node update-dates.js
```

**Résultat attendu** :
```
🚀 Script de Mise à Jour des Dates - Devoirs2026
============================================================

🔌 Connexion à MongoDB...

📊 45 devoirs trouvés dans la base de données

📅 Dates actuelles dans la base :
   - 2025-09-28 : 22 devoirs
   - 2025-09-30 : 23 devoirs

🔄 Mise à jour des dates...

📆 Semaine actuelle : du 2025-11-04 au 2025-11-08

   2025-09-28 → 2025-11-03 (dimanche)
   2025-09-30 → 2025-11-05 (mardi)

📝 Application des mises à jour...

   ✅ 22 devoirs mis à jour : 2025-09-28 → 2025-11-03
   ✅ 23 devoirs mis à jour : 2025-09-30 → 2025-11-05

🎉 Mise à jour terminée !
   Total : 45 devoirs mis à jour
```

---

### Solution 2 : Mise à Jour Manuelle via MongoDB Atlas

Si vous ne pouvez pas exécuter le script :

1. **Aller sur MongoDB Atlas** : https://cloud.mongodb.com/
2. **Database** → **Browse Collections**
3. **Sélectionner** : Base `devoirs` → Collection `plans`
4. **Filtrer** les devoirs par date :
   ```json
   { "Jour": "2025-09-28" }
   ```
5. **Modifier** chaque document manuellement en changeant la date

**⚠️ Attention** : C'est fastidieux si vous avez beaucoup de devoirs !

---

### Solution 3 : Uploader un Nouveau Fichier Excel

La solution la plus simple si vous n'avez pas beaucoup de devoirs :

1. **Créer un nouveau fichier Excel** avec les dates actuelles
2. **Colonnes** : `Enseignant | Jour | Classe | Matière | Devoirs`
3. **Dates** : Utiliser la semaine en cours (ex: `2025-11-04`, `2025-11-05`, etc.)
4. **Uploader** via l'interface admin

**Avantage** : Simple et direct  
**Inconvénient** : Doit retaper tous les devoirs

---

## 📅 Correspondance des Jours de la Semaine

Voici comment les dates de septembre peuvent être converties en novembre :

### Septembre → Novembre

| Date Septembre | Jour | Date Novembre | Jour |
|----------------|------|---------------|------|
| 2025-09-28 | Dimanche | 2025-11-02 | Dimanche |
| 2025-09-29 | Lundi | 2025-11-03 | Lundi |
| 2025-09-30 | Mardi | 2025-11-04 | Mardi |
| 2025-10-01 | Mercredi | 2025-11-05 | Mercredi |
| 2025-10-02 | Jeudi | 2025-11-06 | Jeudi |

---

## 🎯 Après la Mise à Jour

Une fois les dates mises à jour :

### Test 1 : Espace Enseignant

1. Se connecter en tant qu'enseignant
2. Sélectionner son nom (ex: "Zine")
3. **Résultat attendu** : Les semaines avec les nouvelles dates apparaissent
4. Sélectionner la semaine actuelle
5. **Résultat attendu** : Les devoirs s'affichent

### Test 2 : Espace Parent

1. Aller dans "Espace Parent"
2. Sélectionner une classe (ex: "PEI1")
3. Sélectionner un élève
4. **Résultat attendu** : Les devoirs du jour s'affichent
5. Naviguer entre les jours avec les flèches
6. **Résultat attendu** : Les devoirs de chaque jour apparaissent

---

## 🔧 Format des Dates dans MongoDB

### Format Requis

Les dates dans MongoDB doivent être au format **string** : `YYYY-MM-DD`

**Exemples valides** :
- ✅ `"2025-11-04"`
- ✅ `"2025-11-05"`
- ✅ `"2025-11-06"`

**Exemples invalides** :
- ❌ `new Date("2025-11-04")` (objet Date)
- ❌ `"04/11/2025"` (format français)
- ❌ `"dimanche 2 novembre 2025"` (texte)

---

## 📊 Vérification dans MongoDB Atlas

Pour vérifier que la mise à jour a fonctionné :

1. **MongoDB Atlas** → **Browse Collections**
2. **Base** : `devoirs` → **Collection** : `plans`
3. **Vérifier** que les champs `Jour` ont les nouvelles dates
4. **Exemple de document attendu** :
```json
{
  "_id": ObjectId("68dac3cec7d4f57deef31086"),
  "Enseignant": "Zine",
  "Jour": "2025-11-04",
  "Classe": "PEI1",
  "Matière": "Sciences",
  "Devoirs": "Faire les exercices 1 et 2 page 14..."
}
```

---

## 🆘 Problèmes Courants

### Problème 1 : "Aucun devoir pour ce jour"

**Cause** : Les dates ne correspondent pas à la semaine actuelle

**Solution** :
1. Vérifier les dates dans MongoDB (doivent être novembre 2025)
2. Utiliser le script `update-dates.js` pour corriger automatiquement

---

### Problème 2 : "Liste des enseignants vide"

**Cause** : Aucun devoir dans la base de données OU toutes les dates sont en weekend

**Solution** :
1. Vérifier qu'il y a des devoirs dans MongoDB Atlas
2. Vérifier que les dates sont entre dimanche et jeudi (pas vendredi/samedi)
3. Uploader un fichier Excel avec des devoirs

---

### Problème 3 : Le script ne fonctionne pas

**Cause** : Variable `MONGODB_URI` non définie ou incorrecte

**Solution** :
```bash
# Vérifier la variable
echo $MONGODB_URI

# Si vide, la définir
export MONGODB_URI="votre_chaine_de_connexion"

# Réessayer le script
node update-dates.js
```

---

## 📞 Support

Si vous avez besoin d'aide :

1. **Vérifier les logs** du script
2. **Consulter MongoDB Atlas** pour voir les données
3. **Utiliser le script de diagnostic** : `node diagnose.js`

---

## 📚 Documents Liés

- `update-dates.js` - Script de mise à jour automatique
- `diagnose.js` - Script de diagnostic MongoDB
- `TEMPLATE_PLANNING.md` - Template pour créer un fichier Excel
- `SOLUTION_FINALE.md` - Guide complet de résolution des problèmes

---

**Date de Création** : 4 novembre 2025  
**Version** : 1.0  
**Application** : Devoirs2026
