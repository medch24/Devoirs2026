#!/usr/bin/env node

/**
 * Script pour vérifier le contenu de la base de données MongoDB
 */

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ MONGODB_URI non définie');
    process.exit(1);
}

async function checkDatabase() {
    let client;
    
    try {
        console.log('🔌 Connexion à MongoDB...\n');
        client = new MongoClient(uri);
        await client.connect();
        
        const db = client.db('devoirs');
        
        // Lister toutes les collections
        const collections = await db.listCollections().toArray();
        console.log('📦 Collections disponibles :');
        collections.forEach(col => {
            console.log(`   - ${col.name}`);
        });
        
        console.log('\n📊 Contenu de chaque collection :\n');
        
        // Vérifier chaque collection
        for (const col of collections) {
            const collection = db.collection(col.name);
            const count = await collection.countDocuments();
            console.log(`📁 Collection "${col.name}" : ${count} documents`);
            
            if (count > 0) {
                const sample = await collection.findOne();
                console.log(`   Exemple de document :`);
                console.log(`   ${JSON.stringify(sample, null, 2).substring(0, 300)}...\n`);
            } else {
                console.log(`   ⚠️  Vide\n`);
            }
        }
        
        // Vérifier spécifiquement la collection 'plans'
        console.log('🔍 Vérification détaillée de la collection "plans" :\n');
        const plansCollection = db.collection('plans');
        const plansCount = await plansCollection.countDocuments();
        
        if (plansCount === 0) {
            console.log('❌ La collection "plans" est VIDE !');
            console.log('   Cela explique pourquoi aucun devoir ne s\'affiche.\n');
            console.log('💡 Solutions possibles :');
            console.log('   1. Uploadez un fichier Excel via l\'Espace Enseignant');
            console.log('   2. Ajoutez manuellement des documents dans MongoDB Atlas');
            console.log('   3. Restaurez une sauvegarde si disponible\n');
        } else {
            console.log(`✅ ${plansCount} devoirs trouvés`);
            
            // Afficher les dates uniques
            const dates = await plansCollection.distinct('Jour');
            console.log(`\n📅 Dates présentes dans la base :`);
            dates.sort().forEach(date => {
                console.log(`   - ${date}`);
            });
            
            // Afficher les enseignants
            const teachers = await plansCollection.distinct('Enseignant');
            console.log(`\n👨‍🏫 Enseignants présents dans la base :`);
            teachers.sort().forEach(teacher => {
                console.log(`   - ${teacher}`);
            });
        }
        
    } catch (error) {
        console.error('\n❌ ERREUR :', error.message);
    } finally {
        if (client) {
            await client.close();
            console.log('\n🔌 Connexion fermée');
        }
    }
}

checkDatabase().catch(console.error);
