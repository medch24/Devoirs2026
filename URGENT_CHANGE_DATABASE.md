# ⚠️ URGENT - CHANGER LA BASE DE DONNÉES

## 🎯 Problème Identifié

L'application charge actuellement les données de la base **`devoirs`** (225 documents).

Vous voulez charger les données de la base **`test`** (693 documents dans `plans`).

---

## ✅ Solution Immédiate

### **Modifier l'URI MongoDB dans Vercel**

**URI ACTUELLE (mauvaise base)** :
```
mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/devoirs?retryWrites=true&w=majority
                                                                          ^^^^^^^
                                                                          BASE = devoirs
```

**URI CORRECTE (base "test")** :
```
mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/test?retryWrites=true&w=majority
                                                                        ^^^^
                                                                        BASE = test
```

---

## 📋 Étapes à Suivre (2 MINUTES)

### **1. Accéder à Vercel**

[https://vercel.com/medch24/devoirs2026/settings/environment-variables](https://vercel.com/medch24/devoirs2026/settings/environment-variables)

### **2. Modifier MONGODB_URI**

Trouvez : `MONGODB_URI`

**Remplacez par** :
```
mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/test?retryWrites=true&w=majority
```

**⚠️ IMPORTANT** : Changez seulement `/devoirs` en `/test`

### **3. Sauvegarder et Redéployer**

1. Cliquez sur **Save**
2. Allez dans **Deployments**
3. Cliquez sur **Redeploy**

---

## 📊 Données Disponibles dans "test.plans"

D'après votre screenshot MongoDB Atlas :

**Collection** : `test.plans`

**Documents** : **693 devoirs**

**Exemple de document** :
```json
{
  "_id": ObjectId("68dac3ce764f576ee511888"),
  "Enseignant": "Abaa",
  "Jour": "2025-09-30",
  "Classe": "PEI1",
  "Matière": "Sciences",
  "Devoirs": "Faire les exercices 1 et 2 page 14 dans mon cahier d'activités"
}
```

---

## 🔍 Vérification Immédiate

Une fois la modification faite dans Vercel :

```bash
# Tester l'API
curl https://devoirs2026.vercel.app/api/initial-data

# Devrait retourner les données de "test.plans" (693 devoirs)
```

---

## 📊 Comparaison des Bases

| Base | Collection | Documents | État |
|------|------------|-----------|------|
| `devoirs` | plans | 225 | ❌ Mauvaise base |
| **`test`** | **plans** | **693** | ✅ **Base correcte** |

---

## ⚡ Alternative : Script de Synchronisation Temporaire

En attendant de changer l'URI dans Vercel, je peux créer un script pour charger les données de `test.plans` :

```bash
node sync-test-database.js
```

Cela copiera les **693 devoirs** de `test.plans` vers l'application.

---

**⚠️ FAITES CETTE MODIFICATION MAINTENANT DANS VERCEL !**

Changez `/devoirs` en `/test` dans MONGODB_URI
