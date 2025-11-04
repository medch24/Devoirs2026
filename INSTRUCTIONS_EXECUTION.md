# 🚀 Instructions d'Exécution du Script de Normalisation des Dates

## ⚠️ Problème de Connexion Sandbox

Le script ne peut pas s'exécuter dans cet environnement sandbox en raison de restrictions réseau DNS pour MongoDB Atlas.

## ✅ Solutions Alternatives

### **Solution 1 : Exécution Locale (RECOMMANDÉE)** ⭐

Exécutez le script depuis votre ordinateur personnel :

```bash
# 1. Cloner le repository
git clone https://github.com/medch24/Devoirs2026.git
cd Devoirs2026

# 2. Installer les dépendances
npm install

# 3. Définir la variable d'environnement
export MONGODB_URI="mongodb+srv://medchelli24:Alkawthar1986@cluster0.5raqb.mongodb.net/devoirs?retryWrites=true&w=majority"

# 4. Exécuter le script
node fix-dates-complete.js
```

**Sur Windows (PowerShell) :**
```powershell
# 3. Définir la variable d'environnement
$env:MONGODB_URI="mongodb+srv://medchelli24:Alkawthar1986@cluster0.5raqb.mongodb.net/devoirs?retryWrites=true&w=majority"

# 4. Exécuter le script
node fix-dates-complete.js
```

---

### **Solution 2 : Modification Manuelle dans MongoDB Atlas**

1. **Accédez à MongoDB Atlas** : [https://cloud.mongodb.com/](https://cloud.mongodb.com/)

2. **Connectez-vous** avec vos identifiants

3. **Naviguez vers votre collection** :
   - Database → Browse Collections
   - Sélectionnez `devoirs` → `plans`

4. **Pour chaque document** :
   - Cliquez sur le bouton **Edit** (crayon)
   - Modifiez le champ `Jour` :
     - Format cible : `YYYY-MM-DD`
     - Exemple : `28/09/2025` → `2025-11-02`
   - Cliquez sur **Update**

**Table de conversion pour la semaine actuelle** :

| Ancien Format | Nouveau Format | Jour |
|---------------|----------------|------|
| 28/09/2025 | 2025-11-02 | Samedi |
| 29/09/2025 | 2025-11-03 | Dimanche |
| 30/09/2025 | 2025-11-04 | Lundi |
| 01/10/2025 | 2025-11-05 | Mardi |
| 02/10/2025 | 2025-11-06 | Mercredi |
| 03/10/2025 | 2025-11-07 | Jeudi |

---

### **Solution 3 : Upload d'un Nouveau Planning Excel**

L'API normalise maintenant automatiquement les dates lors de l'upload !

1. **Préparez un fichier Excel** avec la structure :

| Enseignant | Jour | Classe | Matière | Devoirs |
|------------|------|--------|---------|---------|
| Prof Math | 04/11/2025 | PEI1 | Mathématiques | Ex 1, 2, 3 p.45 |
| Prof Français | 05/11/2025 | PEI1 | Français | Lecture pp.12-15 |

**Formats de dates acceptés** :
- `DD/MM/YYYY` (04/11/2025)
- `MM/DD/YYYY` (11/04/2025)
- `YYYY-MM-DD` (2025-11-04)
- Chiffres arabes : `٠٤/١١/٢٠٢٥`
- Dates textuelles : `4 novembre 2025`

2. **Accédez à l'Espace Enseignant** :
   - Allez sur [https://devoirs2026.vercel.app/](https://devoirs2026.vercel.app/)
   - Cliquez sur **Espace Enseignant**
   - Connectez-vous

3. **Uploadez le fichier Excel** :
   - Cliquez sur **Charger et Mettre à jour**
   - Sélectionnez votre fichier
   - Les dates seront **automatiquement converties** en `YYYY-MM-DD`

---

### **Solution 4 : API REST Directe (Pour Développeurs)**

Utilisez l'API pour normaliser les dates programmatiquement :

```bash
curl -X POST https://devoirs2026.vercel.app/api/upload-plan \
  -H "Content-Type: application/json" \
  -d '[
    {
      "Enseignant": "Prof Math",
      "Jour": "04/11/2025",
      "Classe": "PEI1",
      "Matière": "Mathématiques",
      "Devoirs": "Ex 1, 2, 3 p.45"
    }
  ]'
```

L'API convertira automatiquement `04/11/2025` → `2025-11-04`.

---

## 🔍 Vérification Après Modification

### **Vérifier dans MongoDB Atlas** :

1. Database → Browse Collections
2. `devoirs` → `plans`
3. Vérifiez que les champs `Jour` sont au format `YYYY-MM-DD`

### **Vérifier dans l'Application** :

1. Ouvrez [https://devoirs2026.vercel.app/](https://devoirs2026.vercel.app/)
2. Cliquez sur **Espace Parent**
3. Sélectionnez une classe et un élève
4. Les devoirs devraient maintenant s'afficher pour la semaine actuelle

---

## 📊 État Actuel de Votre Base de Données

D'après les diagnostics précédents, votre base MongoDB contient :

- **45 devoirs** avec des dates de septembre 2025
- Formats variés : `28/09/2025`, `30/09/2025`, etc.

**Après normalisation, vous aurez** :

- Toutes les dates au format `YYYY-MM-DD`
- Toutes les dates dans la semaine actuelle (novembre 2025)
- L'application affichera les devoirs correctement

---

## 🎯 Quelle Solution Choisir ?

| Solution | Avantages | Inconvénients | Temps |
|----------|-----------|---------------|-------|
| **1. Script Local** | ✅ Automatique<br>✅ Rapide<br>✅ Fiable | ⚠️ Nécessite Node.js | 2 min |
| **2. Modification Manuelle** | ✅ Aucun outil requis<br>✅ Contrôle total | ⚠️ Fastidieux (45 devoirs) | 30 min |
| **3. Nouveau Planning Excel** | ✅ Simple<br>✅ Interface familière | ⚠️ Nécessite recréer le fichier | 15 min |
| **4. API REST** | ✅ Programmatique | ⚠️ Technique | 10 min |

**💡 Recommandation** : **Solution 1 (Script Local)** si vous avez accès à votre ordinateur avec Node.js installé.

---

## 🔒 Rappel de Sécurité

⚠️ **Après avoir corrigé les dates, changez immédiatement votre mot de passe MongoDB** :

1. MongoDB Atlas → Database Access
2. Edit utilisateur `medchelli24`
3. Edit Password
4. Générer un nouveau mot de passe
5. Mettre à jour `MONGODB_URI` dans Vercel

---

## 📞 Besoin d'Aide ?

Si vous rencontrez des difficultés :

1. Vérifiez la connexion MongoDB dans Atlas
2. Vérifiez les logs Vercel : [https://vercel.com/medch24/devoirs2026](https://vercel.com/medch24/devoirs2026)
3. Testez l'API directement : `curl https://devoirs2026.vercel.app/api/initial-data`

---

## ✅ Checklist de Réussite

- [ ] Choisir une solution (1, 2, 3, ou 4)
- [ ] Exécuter la solution choisie
- [ ] Vérifier MongoDB Atlas (dates au format YYYY-MM-DD)
- [ ] Vérifier l'application web (devoirs affichés)
- [ ] Changer le mot de passe MongoDB
- [ ] Mettre à jour Vercel avec le nouveau mot de passe
- [ ] Tester l'Espace Parent
- [ ] Tester l'Espace Enseignant

---

**Date** : 4 novembre 2025  
**Statut** : Code déployé, script prêt à l'emploi  
**Repository** : [https://github.com/medch24/Devoirs2026](https://github.com/medch24/Devoirs2026)
