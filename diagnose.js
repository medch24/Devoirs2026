#!/usr/bin/env node

/**
 * Script de Diagnostic - Devoirs2026
 * 
 * Ce script vérifie la configuration et la connectivité de l'application.
 * Usage: node diagnose.js
 */

const { MongoClient } = require('mongodb');

console.log('🔍 Diagnostic Devoirs2026\n');
console.log('=' .repeat(60));

// 1. Vérifier la variable d'environnement
console.log('\n1️⃣  Vérification de la variable d\'environnement MONGODB_URI');
console.log('-'.repeat(60));

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.log('❌ ERREUR : MONGODB_URI n\'est pas définie');
    console.log('\n📋 Solution :');
    console.log('   1. Créer un fichier .env à la racine du projet');
    console.log('   2. Ajouter : MONGODB_URI=votre_chaine_de_connexion');
    console.log('   3. Pour Vercel : Configurer dans Settings → Environment Variables');
    console.log('\n   Voir DEPLOYMENT_CHECKLIST.md pour plus de détails\n');
    process.exit(1);
}

console.log('✅ MONGODB_URI est définie');
console.log(`   Longueur : ${uri.length} caractères`);
console.log(`   Préfixe  : ${uri.substring(0, 20)}...`);

// 2. Vérifier le format de la chaîne de connexion
console.log('\n2️⃣  Vérification du format de la chaîne de connexion');
console.log('-'.repeat(60));

if (uri.startsWith('mongodb+srv://')) {
    console.log('✅ Format correct : mongodb+srv://');
} else if (uri.startsWith('mongodb://')) {
    console.log('⚠️  Format MongoDB classique détecté (non SRV)');
} else {
    console.log('❌ Format incorrect : doit commencer par mongodb:// ou mongodb+srv://');
    process.exit(1);
}

// Vérifier la présence du nom de base de données
if (uri.includes('/devoirs?') || uri.includes('/devoirs')) {
    console.log('✅ Nom de base de données trouvé : devoirs');
} else {
    console.log('⚠️  Nom de base de données non trouvé dans l\'URI');
    console.log('   Format attendu : .../devoirs?retryWrites=true...');
}

// 3. Tester la connexion à MongoDB
console.log('\n3️⃣  Test de connexion à MongoDB Atlas');
console.log('-'.repeat(60));

async function testConnection() {
    let client;
    try {
        console.log('⏳ Connexion en cours...');
        
        client = new MongoClient(uri, {
            serverSelectionTimeoutMS: 5000, // 5 secondes timeout
        });
        
        await client.connect();
        
        console.log('✅ Connexion réussie à MongoDB Atlas');
        
        // Tester l'accès à la base de données
        const db = client.db('devoirs');
        console.log('✅ Accès à la base de données "devoirs"');
        
        // Lister les collections
        const collections = await db.listCollections().toArray();
        console.log(`✅ Collections trouvées : ${collections.length}`);
        
        if (collections.length === 0) {
            console.log('\n⚠️  ATTENTION : Aucune collection dans la base de données');
            console.log('   La base de données est vide. Vous devez :');
            console.log('   1. Vous connecter en tant qu\'admin');
            console.log('   2. Uploader le fichier Excel du planning');
        } else {
            console.log('\n📊 Collections disponibles :');
            collections.forEach(col => {
                console.log(`   - ${col.name}`);
            });
            
            // Vérifier les collections essentielles
            const essentialCollections = [
                'plans',
                'evaluations',
                'daily_stars',
                'students_of_the_week'
            ];
            
            console.log('\n🔍 Vérification des collections essentielles :');
            for (const colName of essentialCollections) {
                const exists = collections.some(c => c.name === colName);
                if (exists) {
                    const collection = db.collection(colName);
                    const count = await collection.countDocuments();
                    console.log(`   ✅ ${colName.padEnd(25)} : ${count} documents`);
                } else {
                    console.log(`   ❌ ${colName.padEnd(25)} : Collection manquante`);
                }
            }
        }
        
        console.log('\n🎉 Diagnostic terminé avec succès !');
        console.log('   L\'application devrait fonctionner correctement.\n');
        
    } catch (error) {
        console.log('❌ Erreur de connexion');
        console.log(`   Type : ${error.name}`);
        console.log(`   Message : ${error.message}`);
        
        console.log('\n📋 Solutions possibles :');
        
        if (error.message.includes('Authentication failed')) {
            console.log('   ❌ Problème d\'authentification');
            console.log('      1. Vérifier le nom d\'utilisateur et mot de passe');
            console.log('      2. Réinitialiser le mot de passe dans MongoDB Atlas');
            console.log('      3. Encoder les caractères spéciaux du mot de passe');
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
            console.log('   ❌ Problème de réseau');
            console.log('      1. Vérifier la connexion internet');
            console.log('      2. Dans MongoDB Atlas → Network Access');
            console.log('      3. Ajouter 0.0.0.0/0 pour autoriser tous les accès');
        } else if (error.message.includes('MongoServerError')) {
            console.log('   ❌ Erreur du serveur MongoDB');
            console.log('      1. Vérifier que le cluster est actif dans MongoDB Atlas');
            console.log('      2. Vérifier les quotas de votre plan gratuit');
        } else {
            console.log('   ❌ Erreur inconnue');
            console.log('      Consulter la documentation MongoDB ou Vercel');
        }
        
        console.log('');
        process.exit(1);
        
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Connexion fermée\n');
        }
    }
}

testConnection().catch(console.error);
