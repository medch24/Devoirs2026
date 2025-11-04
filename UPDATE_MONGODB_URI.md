# 🔧 MISE À JOUR URGENTE - Connexion à VOTRE Base MongoDB

## ⚠️ ACTION IMMÉDIATE REQUISE

L'application utilise actuellement une **mauvaise URI MongoDB**. Il faut la changer pour utiliser **VOTRE vraie base**.

---

## 📋 Étapes à Suivre (URGENT)

### **1. Accéder à Vercel**

Allez sur : [https://vercel.com/medch24/devoirs2026/settings/environment-variables](https://vercel.com/medch24/devoirs2026/settings/environment-variables)

---

### **2. Modifier la Variable d'Environnement**

Trouvez la variable : `MONGODB_URI`

**❌ ANCIENNE VALEUR (à supprimer)** :
```
mongodb+srv://medchelli24:Alkawthar1986@cluster0.5raqb.mongodb.net/devoirs?retryWrites=true&w=majority
```

**✅ NOUVELLE VALEUR (à utiliser)** :
```
mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/devoirs?retryWrites=true&w=majority
```

---

### **3. Redéployer l'Application**

Après avoir changé la variable :

1. Cliquez sur **Save**
2. Allez dans **Deployments**
3. Cliquez sur les **3 points** du dernier déploiement
4. Cliquez sur **Redeploy**

Ou attendez simplement le prochain commit (Vercel redéploiera automatiquement).

---

## 🔍 Vérification

Une fois la modification effectuée, testez :

```bash
curl https://devoirs2026.vercel.app/api/initial-data
```

**Vous devriez voir** :
- Vos vrais enseignants
- Vos vrais devoirs (225 documents)
- Vos vraies classes

---

## 📊 État de VOTRE Base MongoDB

**URI** : `mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/`

**Base** : `devoirs`

**Collection** : `plans`

**Documents** : **225 devoirs**

**Contenu** : Vos vraies données (septembre + autres périodes)

---

## ⚡ Commande Rapide pour Changer (Alternative)

Si vous avez `vercel-cli` installé :

```bash
cd /home/user/webapp
vercel env rm MONGODB_URI production
vercel env add MONGODB_URI production
# Entrer : mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/devoirs?retryWrites=true&w=majority
vercel --prod
```

---

## 🎯 Résultat Attendu

Après le changement :

✅ Application connectée à **VOTRE** base MongoDB  
✅ Chargement de **VOS** vraies données (225 devoirs)  
✅ Fini les données de test  
✅ Connexion directe à `devoirs.m5p4c1w.mongodb.net`  

---

**⚠️ FAITES CETTE MODIFICATION MAINTENANT pour que l'application utilise VOS vraies données !**
