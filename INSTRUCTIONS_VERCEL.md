# 🚨 INSTRUCTIONS URGENTES - Changer l'URI MongoDB dans Vercel

## ⚠️ PROBLÈME ACTUEL

Votre application est configurée pour utiliser la base **`devoirs`**, mais TOUTES vos vraies données sont dans la base **`test`** :

| Collection | Base `devoirs` | Base `test` ✅ |
|------------|----------------|----------------|
| plans (devoirs) | 225 | **673** |
| evaluations (notes) | 0 | **1790** |
| students_of_the_week | 0 | **5** |

---

## ✅ SOLUTION EN 3 ÉTAPES (2 MINUTES)

### **Étape 1 : Accéder à Vercel**

Cliquez sur ce lien : [https://vercel.com/medch24/devoirs2026/settings/environment-variables](https://vercel.com/medch24/devoirs2026/settings/environment-variables)

Connectez-vous si nécessaire.

---

### **Étape 2 : Modifier MONGODB_URI**

1. **Trouvez** la variable : `MONGODB_URI`

2. **Cliquez** sur les **3 points** (⋮) → **Edit**

3. **La valeur actuelle** ressemble à :
   ```
   mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/devoirs?retryWrites=true&w=majority
   ```

4. **Changez `/devoirs` en `/test`** :
   ```
   mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/test?retryWrites=true&w=majority
                                                                        ^^^^
                                                                        CHANGEZ ICI
   ```

5. **Cliquez sur "Save"**

---

### **Étape 3 : Redéployer**

Après avoir sauvegardé :

**Option A** : Vercel va automatiquement redéployer

**Option B** : Forcer le redéploiement :
1. Allez dans **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Cliquez sur **Redeploy**

---

## 🔍 Vérification (5 secondes)

Après le redéploiement, testez :

1. Allez sur : https://devoirs2026.vercel.app/
2. **Espace Parent** → PEI1 → Jad
3. Regardez le **29 septembre 2025**

**Vous devriez voir** :
- Les notes : Participation: 7, Comportement: 6
- Le commentaire : "Il faut faire les devoirs"

✅ **Si vous voyez ces données, c'est bon !**

---

## 📊 Ce Qui Va Fonctionner

Une fois l'URI changée :

✅ **Lecture des 673 devoirs** de test.plans  
✅ **Lecture des 1790 évaluations** de test.evaluations  
✅ **Affichage des notes et commentaires**  
✅ **Sauvegarde de nouvelles évaluations** dans test.evaluations  
✅ **Calcul des étoiles** dans test.daily_stars  
✅ **Élève de la semaine** depuis test.students_of_the_week  

---

## 🎯 Avant/Après

### **AVANT** (Base `devoirs`) ❌
```
Plans : 225 devoirs (données de test)
Evaluations : 0 (vide)
Notes : Aucune
Commentaires : Aucun
```

### **APRÈS** (Base `test`) ✅
```
Plans : 673 devoirs (VOS vraies données)
Evaluations : 1790 (VOS vraies notes)
Notes : Participation, Comportement
Commentaires : "Il faut faire les devoirs", etc.
```

---

## ⚠️ IMPORTANT

**UNE SEULE CHOSE À FAIRE** :

Dans Vercel → Settings → Environment Variables → MONGODB_URI

Changez : `/devoirs` → `/test`

**C'EST TOUT !**

Aucun changement de code nécessaire. L'application utilisera automatiquement toutes les collections de la base `test`.

---

## 🆘 Si Vous Avez un Problème

1. **Vérifiez** que vous avez bien changé `/devoirs` en `/test`
2. **Vérifiez** que vous avez cliqué sur "Save"
3. **Attendez** 1-2 minutes que Vercel redéploie
4. **Rafraîchissez** l'application (Ctrl+F5)

---

## 📞 Vérification Technique

Après le changement, testez l'API :

```bash
curl https://devoirs2026.vercel.app/api/initial-data | jq '{teachers: .teachers, count: (.planData | length)}'
```

**Devrait afficher** :
- 18 enseignants (Zine, Abas, Sylvano...)
- 673 devoirs

---

**🚨 FAITES CETTE MODIFICATION MAINTENANT !**

**Temps estimé : 2 MINUTES**

**Résultat : Application 100% fonctionnelle avec VOS vraies données**
