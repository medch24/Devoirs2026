# 🚨 GUIDE DE CORRECTION DE SÉCURITÉ URGENT - Credentials MongoDB Exposés

## ⚠️ SITUATION ACTUELLE

GitHub Secret Scanning a détecté des **identifiants MongoDB exposés publiquement** dans votre repository.

**Niveau de risque** : 🔴 CRITIQUE - Accès public à votre base de données

**Détails** :
- Type : MongoDB Atlas Database URI with credentials
- Fichier : `README.md` (ligne 117 dans l'historique Git)
- Status : Public leak
- Impact : N'importe qui peut accéder à votre base de données

---

## 📋 PLAN D'ACTION IMMÉDIAT (3 ÉTAPES)

### ✅ ÉTAPE 1 : RÉVOQUER LES CREDENTIALS EXPOSÉS (URGENT - 5 MIN)

#### 1.1 Se connecter à MongoDB Atlas
1. Allez sur https://cloud.mongodb.com/
2. Connectez-vous à votre compte
3. Sélectionnez votre projet

#### 1.2 Changer le mot de passe de l'utilisateur
1. Dans le menu de gauche → **Database Access**
2. Trouvez l'utilisateur exposé (celui dans la chaîne de connexion)
3. Cliquez sur **Edit** (crayon)
4. Cliquez sur **Edit Password**
5. Choisissez **Autogenerate Secure Password** 
6. Copiez le nouveau mot de passe dans un endroit sûr (vous en aurez besoin)
7. Cliquez sur **Update User**

**OU MIEUX** : Supprimez complètement l'ancien utilisateur et créez-en un nouveau :

1. **Database Access** → Cliquez sur **DELETE** pour l'ancien utilisateur
2. Cliquez sur **+ ADD NEW DATABASE USER**
3. Méthode d'authentification : **Password**
4. Username : Créez un nouveau nom (ex: `devoirs_prod_2025`)
5. Password : Cliquez sur **Autogenerate Secure Password** et **copiez-le**
6. Database User Privileges : Sélectionnez **Read and write to any database**
7. Cliquez sur **Add User**

#### 1.3 Restreindre l'accès réseau (optionnel mais recommandé)
1. Dans le menu de gauche → **Network Access**
2. Si vous voyez `0.0.0.0/0` (accès depuis n'importe où), c'est risqué
3. Pour Vercel, vous devez garder `0.0.0.0/0` OU ajouter les IPs de Vercel
4. Pour plus de sécurité, ajoutez uniquement les IPs nécessaires

---

### ✅ ÉTAPE 2 : CONFIGURER VERCEL AVEC LES NOUVEAUX CREDENTIALS (10 MIN)

#### 2.1 Créer la nouvelle chaîne de connexion
Avec vos nouveaux identifiants, la chaîne de connexion sera :

```
mongodb+srv://NOUVEAU_USERNAME:NOUVEAU_PASSWORD@cluster0.xxxxx.mongodb.net/devoirs2026?retryWrites=true&w=majority
```

Remplacez :
- `NOUVEAU_USERNAME` : Le nom d'utilisateur que vous avez créé
- `NOUVEAU_PASSWORD` : Le mot de passe généré (attention aux caractères spéciaux, ils doivent être encodés en URL)
- `cluster0.xxxxx.mongodb.net` : Votre cluster (trouvez-le dans MongoDB Atlas → Connect)
- `devoirs2026` : Le nom de votre base de données

**Important** : Si votre mot de passe contient des caractères spéciaux (@, :, /, etc.), vous devez les encoder :
- @ devient %40
- : devient %3A
- / devient %2F
- etc.

Ou utilisez cet outil en ligne : https://www.urlencoder.org/

#### 2.2 Configurer la variable d'environnement dans Vercel

**Option A : Via Vercel Dashboard (Interface Web)**

1. Allez sur https://vercel.com/
2. Connectez-vous et sélectionnez votre projet `Devoirs2026`
3. Cliquez sur **Settings** (en haut)
4. Dans le menu de gauche → **Environment Variables**
5. Ajoutez ou modifiez la variable :
   - **Name** : `MONGODB_URI`
   - **Value** : Collez votre nouvelle chaîne de connexion complète
   - **Environments** : Cochez **Production**, **Preview**, et **Development**
6. Cliquez sur **Save**

**Option B : Via Vercel CLI**

```bash
# Installer Vercel CLI si ce n'est pas fait
npm install -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Ajouter la variable d'environnement
vercel env add MONGODB_URI

# Quand demandé :
# - Collez votre nouvelle MONGODB_URI
# - Sélectionnez : Production, Preview, Development (toutes)
```

#### 2.3 Redéployer l'application

**Via Dashboard** :
1. Dans votre projet Vercel → **Deployments**
2. Trouvez le dernier déploiement
3. Cliquez sur les trois points ⋯ → **Redeploy**
4. Confirmez avec **Redeploy**

**Via CLI** :
```bash
cd /path/to/Devoirs2026
vercel --prod
```

#### 2.4 Vérifier que ça fonctionne
1. Attendez que le déploiement soit terminé (1-2 minutes)
2. Ouvrez votre application : https://votre-projet.vercel.app
3. Testez la connexion (connexion enseignant/admin, affichage des données)
4. Vérifiez les logs Vercel pour voir s'il y a des erreurs

---

### ✅ ÉTAPE 3 : NETTOYER LE REPOSITORY GIT (20 MIN)

#### Option 3A : Solution Simple - Forcer un nouveau commit propre (RECOMMANDÉ)

Cette méthode est plus simple mais l'historique GitHub gardera une trace.

```bash
# 1. Vérifier que les fichiers actuels sont propres
cd /path/to/Devoirs2026
git status

# 2. S'assurer que README.md utilise bien des placeholders
cat README.md | grep -A 2 "MONGODB_URI"
# Doit afficher : MONGODB_URI=mongodb+srv://votre-username:votre-password@cluster...

# 3. Créer un commit de sécurité
git add .
git commit -m "security: remove exposed MongoDB credentials from documentation"

# 4. Pusher sur GitHub
git push origin main
```

**Note** : GitHub continuera à montrer l'alerte car l'historique contient toujours les anciens commits. Mais comme vous avez révoqué les credentials, ils ne sont plus valides.

#### Option 3B : Solution Avancée - Nettoyer l'historique Git

⚠️ **ATTENTION** : Cette méthode réécrit l'historique Git. À utiliser avec précaution.

```bash
# 1. Installer BFG Repo-Cleaner (outil de nettoyage Git)
# Sur macOS
brew install bfg

# Sur Ubuntu/Debian
sudo apt-get install bfg

# Sur Windows, téléchargez depuis : https://rtyley.github.io/bfg-repo-cleaner/

# 2. Créer une sauvegarde
cd /path/to/Devoirs2026
cd ..
cp -r Devoirs2026 Devoirs2026_backup

# 3. Créer un fichier avec les mots à remplacer
cd Devoirs2026
echo "mongodb+srv://ancien-user:ancien-password@cluster" > passwords.txt

# 4. Nettoyer l'historique
bfg --replace-text passwords.txt

# 5. Nettoyer Git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 6. Forcer le push (ATTENTION : réécrit l'historique)
git push --force origin main
```

#### Option 3C : Solution Radicale - Nouveau Repository (SI NÉCESSAIRE)

Si les options précédentes ne fonctionnent pas :

1. **Créer un nouveau repository** sur GitHub (ex: `Devoirs2026-v2`)
2. **Cloner votre code actuel** (sans l'historique)
3. **Pusher vers le nouveau repository**
4. **Mettre à jour Vercel** pour pointer vers le nouveau repository
5. **Archiver l'ancien repository** (le rendre privé ou le supprimer)

```bash
# 1. Créer une copie propre (sans .git)
cd /path/to
cp -r Devoirs2026 Devoirs2026-clean
cd Devoirs2026-clean
rm -rf .git

# 2. Initialiser un nouveau repository
git init
git add .
git commit -m "Initial commit - clean repository"

# 3. Créer le nouveau repo sur GitHub et pusher
git remote add origin https://github.com/medch24/Devoirs2026-v2.git
git branch -M main
git push -u origin main

# 4. Dans Vercel Dashboard :
# Settings → Git → Disconnect
# Reconnect avec le nouveau repository
```

---

## 🔒 BONNES PRATIQUES DE SÉCURITÉ (POUR ÉVITER CE PROBLÈME)

### ✅ À FAIRE (DO)

1. **Variables d'environnement** :
   - Toujours utiliser des variables d'environnement pour les secrets
   - Les configurer dans Vercel Dashboard uniquement
   - Ne JAMAIS les committer dans Git

2. **Fichier .env.example** :
   ```bash
   # Créer un template sans valeurs réelles
   echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname" > .env.example
   git add .env.example
   ```

3. **Fichier .gitignore** :
   ```bash
   # S'assurer que .env est ignoré
   echo ".env" >> .gitignore
   echo ".env.local" >> .gitignore
   git add .gitignore
   ```

4. **Documentation** :
   ```markdown
   ## Configuration

   Créer un fichier `.env` à la racine :
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/dbname
   ```

   **Remplacez** `your-username`, `your-password`, et `cluster` par vos vraies valeurs.
   ```

### ❌ À NE PAS FAIRE (DON'T)

1. ❌ Ne jamais committer de fichiers `.env` avec de vraies valeurs
2. ❌ Ne jamais mettre de credentials dans le code source
3. ❌ Ne jamais mettre de credentials dans README.md ou documentation
4. ❌ Ne jamais partager de captures d'écran avec des credentials visibles
5. ❌ Ne jamais pusher des credentials dans l'historique Git

---

## 🧪 TESTS DE VÉRIFICATION

### Test 1 : Vérifier que les nouveaux credentials fonctionnent

```bash
# Test avec Node.js
node -e "
const { MongoClient } = require('mongodb');
const uri = 'VOTRE_NOUVELLE_URI';
const client = new MongoClient(uri);
client.connect()
  .then(() => {
    console.log('✅ Connexion MongoDB réussie');
    return client.close();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion:', err.message);
  });
"
```

### Test 2 : Vérifier l'application déployée

1. Ouvrez votre app Vercel
2. Connectez-vous en tant qu'enseignant
3. Vérifiez que les données s'affichent correctement
4. Essayez d'ajouter une évaluation
5. Vérifiez que l'élève de la semaine s'affiche (si dimanche)

### Test 3 : Vérifier les logs Vercel

1. Vercel Dashboard → votre projet
2. **Logs** (dans le menu de gauche)
3. Vérifiez qu'il n'y a pas d'erreurs de connexion MongoDB
4. Recherchez : "Connected to MongoDB" ou "MongoDB connection error"

---

## 📞 SUPPORT ET RESSOURCES

### MongoDB Atlas
- Dashboard : https://cloud.mongodb.com/
- Documentation : https://www.mongodb.com/docs/atlas/
- Support : https://support.mongodb.com/

### Vercel
- Dashboard : https://vercel.com/dashboard
- Documentation : https://vercel.com/docs
- Environment Variables : https://vercel.com/docs/concepts/projects/environment-variables

### GitHub Security
- Security Advisories : https://github.com/medch24/Devoirs2026/security
- Secret Scanning : https://docs.github.com/en/code-security/secret-scanning

---

## ✅ CHECKLIST FINALE

Avant de considérer le problème résolu, vérifiez :

- [ ] Les anciens credentials MongoDB sont révoqués ou supprimés
- [ ] De nouveaux credentials MongoDB sont créés
- [ ] La variable MONGODB_URI est configurée dans Vercel (toutes les environnements)
- [ ] L'application Vercel est redéployée
- [ ] L'application fonctionne correctement (test de connexion)
- [ ] Aucun credential n'est visible dans le code actuel
- [ ] Le fichier .gitignore contient `.env`
- [ ] Un fichier .env.example est créé (avec placeholders)
- [ ] La documentation utilise des placeholders, pas de vraies valeurs

---

## 📝 RÉSUMÉ EN 3 ACTIONS CRITIQUES

```bash
# 1. RÉVOQUER (MongoDB Atlas Dashboard)
#    → Database Access → Edit User → Change Password OU Delete User

# 2. CONFIGURER (Vercel Dashboard)
#    → Settings → Environment Variables → Add MONGODB_URI

# 3. REDÉPLOYER (Vercel Dashboard ou CLI)
#    → Deployments → Redeploy
```

---

**🔴 RAPPEL IMPORTANT** : Les credentials exposés restent publiquement accessibles dans l'historique Git même après correction. C'est pourquoi l'ÉTAPE 1 (révoquer) est CRITIQUE et doit être faite EN PREMIER.

---

*Document créé le : 20 Octobre 2025*
*Priorité : 🔴 URGENT - À traiter immédiatement*
