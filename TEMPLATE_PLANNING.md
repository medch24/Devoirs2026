# 📝 Template Planning Excel - Devoirs2026

## 📊 Structure du Fichier Excel

### Colonnes Requises (Ordre Important)

Votre fichier Excel doit contenir **exactement** ces 5 colonnes dans cet ordre :

1. **Enseignant** - Nom de l'enseignant
2. **Jour** - Date du devoir
3. **Classe** - Classe concernée
4. **Matière** - Matière concernée
5. **Devoirs** - Description du devoir

---

## 📅 Format des Dates (Colonne "Jour")

L'application accepte plusieurs formats de date :

### Format Recommandé (Le Plus Fiable)
```
YYYY-MM-DD
```

Exemples :
- `2025-11-04` (4 novembre 2025)
- `2025-11-05` (5 novembre 2025)
- `2025-11-06` (6 novembre 2025)

### Formats Alternatifs Acceptés
- `DD/MM/YYYY` : `04/11/2025`
- `D-M-YYYY` : `4-11-2025`
- Texte français : `lundi 4 novembre 2025`
- Texte arabe : `الاثنين 4 نوفمبر 2025`

---

## 👥 Classes Disponibles

Selon le code de l'application, voici les classes configurées :

- **PEI1** (Primaire Élémentaire I - 1ère année)
- **PEI2** (Primaire Élémentaire I - 2ème année)
- **PEI3** (Primaire Élémentaire I - 3ème année)
- **PEI4** (Primaire Élémentaire I - 4ème année)
- **DP2** (Degré Préparatoire 2)

---

## 📋 Exemple de Planning Excel

### Semaine du 4 au 8 novembre 2025

| Enseignant | Jour | Classe | Matière | Devoirs |
|------------|------|--------|---------|---------|
| Alkawthar | 2025-11-04 | PEI1 | Mathématiques | Exercices pages 24-25, numéros 1 à 10 |
| Alkawthar | 2025-11-04 | PEI1 | Français | Lire le texte page 15 et répondre aux questions |
| Alkawthar | 2025-11-04 | PEI1 | Sciences | Réviser le chapitre sur les plantes |
| Mohamed | 2025-11-04 | PEI2 | Mathématiques | Faire les exercices de multiplication page 30 |
| Mohamed | 2025-11-04 | PEI2 | Arabe | Apprendre les verbes à la page 12 |
| Alkawthar | 2025-11-05 | PEI1 | Mathématiques | Problèmes page 26, exercices 5 à 8 |
| Alkawthar | 2025-11-05 | PEI1 | Français | Écrire une petite histoire de 10 lignes |
| Mohamed | 2025-11-05 | PEI2 | Sciences | Expérience sur l'eau - préparer le matériel |
| Alkawthar | 2025-11-06 | PEI3 | Mathématiques | Réviser les fractions - exercices page 45 |
| Alkawthar | 2025-11-06 | PEI3 | Français | Rédaction : décrire un paysage (15 lignes) |
| Mohamed | 2025-11-06 | PEI4 | Histoire | Lire le chapitre 3 et faire le résumé |
| Mohamed | 2025-11-06 | PEI4 | Géographie | Carte du monde arabe à compléter |
| Alkawthar | 2025-11-07 | DP2 | Mathématiques | Équations du second degré - série d'exercices |
| Mohamed | 2025-11-07 | DP2 | Physique | Préparer le compte-rendu du TP sur l'électricité |

---

## ⚠️ Points Importants

### 1. Jours de la Semaine
L'application considère la semaine scolaire du **dimanche au jeudi** :
- **Dimanche** = Jour 0
- **Lundi** = Jour 1
- **Mardi** = Jour 2
- **Mercredi** = Jour 3
- **Jeudi** = Jour 4
- **Vendredi et Samedi** = Weekend (pas de devoirs)

### 2. Noms des Enseignants
- Les noms doivent être **cohérents** à travers tout le fichier
- Respecter la **casse** (majuscules/minuscules)
- Un même enseignant doit avoir exactement le même nom partout

### 3. Matières
Exemples de matières courantes :
- Mathématiques
- Français
- Arabe
- Sciences
- Histoire
- Géographie
- Anglais
- Éducation Islamique
- Éducation Physique
- Arts Plastiques
- Musique

### 4. Description des Devoirs
- Soyez **clair et précis**
- Indiquez les **pages** et **numéros d'exercices**
- Mentionnez les **échéances** si nécessaire
- Maximum recommandé : 200 caractères

---

## 📥 Comment Créer le Fichier Excel

### Option 1 : Microsoft Excel / LibreOffice Calc

1. Ouvrir Excel ou Calc
2. Créer un nouveau fichier
3. Dans la **première ligne** (ligne 1), mettre les **en-têtes** :
   - Colonne A : `Enseignant`
   - Colonne B : `Jour`
   - Colonne C : `Classe`
   - Colonne D : `Matière`
   - Colonne E : `Devoirs`
4. Remplir les données à partir de la **ligne 2**
5. Sauvegarder en format **`.xlsx`** ou **`.xls`**

### Option 2 : Google Sheets

1. Créer un nouveau Google Sheet
2. Mettre les en-têtes dans la première ligne
3. Remplir les données
4. Télécharger : **Fichier** → **Télécharger** → **Microsoft Excel (.xlsx)**

---

## 🚀 Uploader le Fichier sur l'Application

### Étape 1 : Se Connecter en Admin

1. Aller sur votre site Vercel
2. Cliquer sur **"Espace Enseignant"**
3. Se connecter avec :
   - Username : `Mohamed86`
   - Password : `Mohamed86`

### Étape 2 : Uploader le Planning

1. Vous verrez la section **"📅 Mettre à jour le planning"**
2. Cliquer sur **"Choisir un fichier"** ou **"Choose File"**
3. Sélectionner votre fichier Excel (`.xlsx` ou `.xls`)
4. Cliquer sur **"Charger et Mettre à jour"**
5. Attendre le message de confirmation (peut prendre 5-10 secondes)
6. Message attendu : `"Planning mis à jour avec X enregistrements."`

### Étape 3 : Vérifier

1. Après l'upload, la section **"1. Choisissez votre nom"** devrait afficher les **noms des enseignants**
2. Cliquer sur un enseignant
3. Sélectionner une semaine
4. Vous devriez voir les **devoirs à évaluer**

---

## 🔍 Vérification de la Base de Données

### Vérifier que les Données Sont Bien Importées

Après l'upload, vous pouvez vérifier sur **MongoDB Atlas** :

1. Aller sur **MongoDB Atlas** → votre cluster
2. Cliquer sur **"Browse Collections"**
3. Sélectionner la base de données **`devoirs`**
4. Vérifier la collection **`plans`**
5. Vous devriez voir vos enregistrements

---

## 📊 Exemple de Fichier Excel Complet (Pour Tester)

Voici un exemple minimal pour tester rapidement :

### Fichier de Test (1 Semaine)

| Enseignant | Jour | Classe | Matière | Devoirs |
|------------|------|--------|---------|---------|
| Alkawthar | 2025-11-04 | PEI1 | Mathématiques | Test exercice 1 |
| Alkawthar | 2025-11-04 | PEI1 | Français | Test exercice 2 |
| Mohamed | 2025-11-04 | PEI2 | Sciences | Test exercice 3 |
| Alkawthar | 2025-11-05 | PEI1 | Arabe | Test exercice 4 |
| Mohamed | 2025-11-05 | PEI2 | Mathématiques | Test exercice 5 |

Créez ce fichier Excel avec ces 5 lignes de données (+ la ligne d'en-tête) pour tester que l'upload fonctionne.

---

## 🆘 Problèmes Courants lors de l'Upload

### Erreur : "Aucune donnée valide trouvée"

**Causes possibles** :
- Fichier Excel vide
- En-têtes incorrects (vérifier l'orthographe exacte)
- Format de date non reconnu

**Solutions** :
- Vérifier que la première ligne contient les en-têtes
- Vérifier l'orthographe : `Enseignant`, `Jour`, `Classe`, `Matière`, `Devoirs`
- Utiliser le format de date `YYYY-MM-DD`

---

### Erreur : "Colonne manquante"

**Cause** : Une des 5 colonnes obligatoires manque

**Solution** : Vérifier que toutes les colonnes sont présentes dans cet ordre exact

---

### Erreur : "Fichier Excel vide ou invalide"

**Cause** : Fichier corrompu ou format non supporté

**Solution** :
- Sauvegarder en format `.xlsx` (pas `.csv`)
- Utiliser Excel, LibreOffice Calc, ou Google Sheets
- Éviter les formats propriétaires

---

## 📞 Support

Si l'upload ne fonctionne toujours pas :

1. Vérifier les logs de l'application dans Vercel
2. Vérifier que le fichier Excel a bien la structure ci-dessus
3. Essayer avec le fichier de test minimal (5 lignes)
4. Vérifier que la connexion MongoDB fonctionne

---

**Date de Création** : 4 novembre 2025  
**Version** : 1.0  
**Application** : Devoirs2026
