# 🚀 Checklist de Déploiement - Devoirs2026

## ✅ Étapes pour Résoudre l'Erreur de Connexion MongoDB

### 1. Vérifier MongoDB Atlas

- [ ] Compte MongoDB Atlas créé et actif
- [ ] Cluster MongoDB créé et en cours d'exécution
- [ ] Base de données `devoirs` créée
- [ ] Collections créées :
  - `plans` (planning des devoirs)
  - `evaluations` (évaluations des élèves)
  - `daily_stars` (étoiles quotidiennes)
  - `students_of_the_week` (élèves de la semaine)
  - `photos_of_the_day` (photos de félicitations)
  - `photos_celebration_2` (photos célébration 2)
  - `photos_celebration_3` (photos célébration 3)

### 2. Configurer l'Accès Réseau MongoDB

- [ ] Aller dans MongoDB Atlas → Network Access
- [ ] Ajouter l'adresse IP : `0.0.0.0/0` (autoriser tous les accès)
  - ⚠️ Note : En production, vous devriez restreindre aux IPs Vercel
- [ ] Sauvegarder les modifications

### 3. Obtenir la Chaîne de Connexion

1. Dans MongoDB Atlas, cliquez sur **"Connect"** pour votre cluster
2. Choisissez **"Connect your application"**
3. Sélectionnez **"Node.js"** comme driver
4. Copiez la chaîne de connexion

Exemple :
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 4. Modifier la Chaîne de Connexion

Remplacez :
- `<username>` par votre nom d'utilisateur MongoDB
- `<password>` par votre mot de passe MongoDB
- Ajoutez `/devoirs` après `.mongodb.net` et avant `?`

Exemple final :
```
mongodb+srv://medch24:MonMotDePasse@cluster0.xxxxx.mongodb.net/devoirs?retryWrites=true&w=majority
```

**⚠️ Caractères spéciaux dans le mot de passe** :
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `+` → `%2B`
- `%` → `%25`
- `#` → `%23`
- `?` → `%3F`

### 5. Configurer Vercel

#### Option A : Via le Dashboard Vercel (Recommandé)

1. Aller sur https://vercel.com/
2. Sélectionner le projet **Devoirs2026**
3. Aller dans **Settings** → **Environment Variables**
4. Cliquer sur **"Add New"**
5. Remplir :
   - **Key** : `MONGODB_URI`
   - **Value** : Votre chaîne de connexion complète
   - **Environments** : Cocher `Production`, `Preview`, et `Development`
6. Cliquer sur **"Save"**

#### Option B : Via Vercel CLI

```bash
cd /home/user/webapp
vercel env add MONGODB_URI
# Coller la chaîne de connexion quand demandé
# Sélectionner tous les environnements
```

### 6. Redéployer l'Application

#### Via Vercel Dashboard :
1. Aller dans **Deployments**
2. Trouver le dernier déploiement
3. Cliquer sur les **"..."** → **"Redeploy"**
4. Confirmer le redéploiement

#### Via Git Push :
```bash
git commit --allow-empty -m "chore: trigger redeploy after env vars update"
git push origin main
```

### 7. Vérifier le Déploiement

- [ ] Aller sur l'URL de production Vercel
- [ ] Tester la connexion enseignant
- [ ] Vérifier que la liste des enseignants s'affiche
- [ ] Vérifier que les devoirs s'affichent
- [ ] Tester l'évaluation d'un élève
- [ ] Vérifier l'affichage des étoiles

### 8. Tests de Fonctionnalité

- [ ] **Espace Parent** : Affichage des devoirs et progression
- [ ] **Espace Enseignant** : Liste des enseignants
- [ ] **Sélection de semaine** : Devoirs par semaine affichés
- [ ] **Évaluation** : Enregistrement des évaluations
- [ ] **Étoiles** : Calcul et affichage corrects
- [ ] **Élève de la semaine** : Affichage le dimanche/lundi
- [ ] **Persistance connexion** : Auto-login fonctionne
- [ ] **Photos de félicitations** : Upload et affichage

## 🔍 Diagnostic des Erreurs

### Erreur : "MONGODB_URI environment variable is not defined"

**Cause** : Variable d'environnement non configurée sur Vercel

**Solution** : Suivre les étapes 5 et 6 ci-dessus

---

### Erreur : "Connection timeout" ou "MongoNetworkError"

**Cause** : Restriction d'accès réseau sur MongoDB Atlas

**Solution** :
1. Aller dans MongoDB Atlas → Network Access
2. Ajouter `0.0.0.0/0` pour autoriser tous les accès
3. Attendre 2-3 minutes que la configuration prenne effet

---

### Erreur : "Authentication failed"

**Cause** : Nom d'utilisateur ou mot de passe incorrect

**Solution** :
1. Vérifier les credentials dans MongoDB Atlas → Database Access
2. Réinitialiser le mot de passe si nécessaire
3. Encoder les caractères spéciaux dans le mot de passe
4. Mettre à jour `MONGODB_URI` sur Vercel

---

### Erreur : "Database 'devoirs' not found"

**Cause** : Nom de base de données incorrect dans la chaîne de connexion

**Solution** :
1. Vérifier que `/devoirs` est bien dans la chaîne de connexion
2. Format correct : `mongodb+srv://...mongodb.net/devoirs?retryWrites=true`

---

### Aucune donnée n'apparaît

**Cause** : Base de données vide ou collections manquantes

**Solution** :
1. Télécharger le fichier Excel du planning
2. Se connecter en tant qu'admin (`Mohamed86` / `Mohamed86`)
3. Uploader le fichier Excel dans la section admin
4. Vérifier que les données sont importées

## 📞 Support

Si le problème persiste après avoir suivi toutes ces étapes :

1. Vérifier les logs Vercel :
   - Aller dans Vercel Dashboard → Deployments
   - Cliquer sur le déploiement
   - Aller dans l'onglet "Functions"
   - Cliquer sur une fonction API
   - Voir les logs d'erreur

2. Tester localement :
   ```bash
   # Créer un fichier .env avec MONGODB_URI
   echo "MONGODB_URI=votre_chaine_de_connexion" > .env
   
   # Installer Vercel CLI
   npm install -g vercel
   
   # Tester en local
   vercel dev
   ```

3. Vérifier la connexion MongoDB directement :
   ```bash
   node -e "const {MongoClient} = require('mongodb'); const client = new MongoClient(process.env.MONGODB_URI); client.connect().then(() => console.log('✅ Connected')).catch(err => console.error('❌ Error:', err.message));"
   ```

---

**Dernière mise à jour** : 4 novembre 2025
