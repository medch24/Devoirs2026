# 📚 Scripts Devoirs2026 - Guide Rapide

## 🎯 Problème à Résoudre

L'application ne montre **aucun devoir** car les dates dans MongoDB ont des formats variés et sont de septembre 2025 au lieu de la semaine actuelle.

---

## 🚀 Solution en Une Commande

### **Pour Utilisateurs Linux/Mac** :

```bash
cd Devoirs2026
export MONGODB_URI="mongodb+srv://medchelli24:Alkawthar1986@cluster0.5raqb.mongodb.net/devoirs?retryWrites=true&w=majority"
node fix-dates-complete.js
```

### **Pour Utilisateurs Windows (PowerShell)** :

```powershell
cd Devoirs2026
$env:MONGODB_URI="mongodb+srv://medchelli24:Alkawthar1986@cluster0.5raqb.mongodb.net/devoirs?retryWrites=true&w=majority"
node fix-dates-complete.js
```

---

## 📁 Scripts Disponibles

| Script | Description | Quand l'utiliser |
|--------|-------------|------------------|
| **fix-dates-complete.js** | ⭐ **SOLUTION COMPLÈTE**<br>Normalise ET met à jour les dates | **À utiliser maintenant** |
| **normalize-all-dates.js** | Normalise uniquement les formats<br>(pas de changement de semaine) | Si les dates sont déjà dans la bonne semaine |
| **update-dates.js** | Met à jour uniquement vers semaine actuelle<br>(suppose que les dates sont au bon format) | Si les formats sont déjà corrects |
| **diagnose.js** | Teste la connexion MongoDB | Pour diagnostiquer les problèmes de connexion |

---

## ✅ Ce Que Fait `fix-dates-complete.js`

### **Étape 1 : Normalisation des Formats**

Convertit toutes les dates en format standard `YYYY-MM-DD` :

| Avant | Après |
|-------|-------|
| `28/09/2025` | `2025-09-28` |
| `٣٠/٩/٢٠٢٥` (arabe) | `2025-09-30` |
| `septembre 30, 2025` | `2025-09-30` |
| `30-09-2025` | `2025-09-30` |
| `09/30/2025` | `2025-09-30` |

### **Étape 2 : Mise à Jour vers Semaine Actuelle**

Déplace les dates vers la semaine courante (2-6 novembre 2025) :

| Après Normalisation | → | Final |
|---------------------|---|-------|
| `2025-09-28` (Dim) | → | `2025-11-03` (Dimanche) |
| `2025-09-30` (Mar) | → | `2025-11-05` (Mardi) |
| `2025-10-01` (Mer) | → | `2025-11-06` (Mercredi) |

---

## 🌍 Formats de Dates Supportés

### **Formats Numériques** ✅

- `YYYY-MM-DD` : 2025-11-15
- `DD/MM/YYYY` : 15/11/2025
- `MM/DD/YYYY` : 11/15/2025
- `DD-MM-YYYY` : 15-11-2025
- `YYYY/MM/DD` : 2025/11/15
- `DDMMYYYY` : 15112025
- `DD.MM.YYYY` : 15.11.2025

### **Formats Textuels** ✅

- `DD MMMM YYYY` : 15 novembre 2025
- `DD MMM YYYY` : 15 nov 2025
- `D MMMM YYYY` : 5 novembre 2025

### **Chiffres Arabes** ✅

- `١٥/١١/٢٠٢٥` → converti en `15/11/2025` → `2025-11-15`

---

## 📊 Exemple de Sortie du Script

```
╔════════════════════════════════════════════════════════════════════╗
║     🚀 SOLUTION COMPLÈTE : NORMALISATION + MISE À JOUR DATES     ║
╚════════════════════════════════════════════════════════════════════╝

🔌 Connexion à MongoDB...

📊 45 devoirs trouvés dans la base de données

📅 Dates ACTUELLES dans la base :
   - "28/09/2025" : 15 devoirs
   - "30/09/2025" : 18 devoirs
   - "01/10/2025" : 12 devoirs

======================================================================
🔄 ÉTAPE 1 : NORMALISATION DES FORMATS
======================================================================

✅ 45 dates converties au format standard

======================================================================
🔄 ÉTAPE 2 : MISE À JOUR VERS LA SEMAINE ACTUELLE
======================================================================

📆 Semaine actuelle : lundi 3 novembre au jeudi 6 novembre 2025

✅ 45 devoirs mis à jour avec succès

📅 DATES FINALES :
   - 2025-11-03 (dimanche 3 novembre 2025) : 15 devoirs
   - 2025-11-05 (mardi 5 novembre 2025) : 18 devoirs
   - 2025-11-06 (mercredi 6 novembre 2025) : 12 devoirs

🎉 TRAITEMENT TERMINÉ AVEC SUCCÈS !
```

---

## 🔍 Vérification Rapide

### **1. Dans MongoDB Atlas** :

```
1. Allez sur https://cloud.mongodb.com/
2. Database → Browse Collections
3. devoirs → plans
4. Vérifiez les champs "Jour" → Doivent être "2025-11-XX"
```

### **2. Dans l'Application** :

```
1. Ouvrez https://devoirs2026.vercel.app/
2. Espace Parent → Choisissez une classe et un élève
3. Les devoirs devraient s'afficher pour la semaine actuelle
```

---

## ⚠️ Note Importante : Sandbox

Le script **ne peut pas s'exécuter dans le sandbox** en raison de restrictions réseau DNS.

**Solutions alternatives** :

1. **Exécution locale** sur votre ordinateur (RECOMMANDÉ)
2. **Modification manuelle** dans MongoDB Atlas
3. **Upload d'un nouveau planning** via l'interface (l'API normalise automatiquement)

Voir [INSTRUCTIONS_EXECUTION.md](./INSTRUCTIONS_EXECUTION.md) pour les détails.

---

## 🔒 Sécurité

⚠️ **Après l'exécution du script** :

```
1. MongoDB Atlas → Database Access
2. Edit utilisateur "medchelli24"
3. Changez le mot de passe
4. Mettez à jour MONGODB_URI dans Vercel
```

---

## 📚 Documentation Complète

- **[SOLUTION_DATES_UNIVERSELLE.md](./SOLUTION_DATES_UNIVERSELLE.md)** : Guide complet détaillé
- **[INSTRUCTIONS_EXECUTION.md](./INSTRUCTIONS_EXECUTION.md)** : Instructions pour toutes les solutions
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** : Guide de déploiement Vercel

---

## ✅ Checklist Rapide

- [ ] Cloner le repository
- [ ] Installer dépendances : `npm install`
- [ ] Définir `MONGODB_URI`
- [ ] Exécuter : `node fix-dates-complete.js`
- [ ] Vérifier MongoDB Atlas
- [ ] Vérifier l'application web
- [ ] Changer le mot de passe MongoDB
- [ ] Mettre à jour Vercel

---

**🎉 Résultat Final** :

✅ Dates au format universel `YYYY-MM-DD`  
✅ Dates dans la semaine actuelle  
✅ Application affiche les devoirs  
✅ Support universel des futurs uploads  

---

**Date de création** : 4 novembre 2025  
**Repository** : [medch24/Devoirs2026](https://github.com/medch24/Devoirs2026)
