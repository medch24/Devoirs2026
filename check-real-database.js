#!/usr/bin/env node

const { MongoClient } = require('mongodb');

// VOTRE vraie URI MongoDB
const uri = "mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/?appName=devoirs";

async function checkRealDatabase() {
    let client;
    
    try {
        console.log('🔌 Connexion à VOTRE base MongoDB...\n');
        client = new MongoClient(uri);
        await client.connect();
        
        console.log('✅ Connexion réussie !\n');
        
        // Lister toutes les bases de données
        const adminDb = client.db().admin();
        const databases = await adminDb.listDatabases();
        
        console.log('📦 BASES DE DONNÉES DISPONIBLES :');
        databases.databases.forEach(db => {
            console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });
        
        // Examiner la base "devoirs"
        console.log('\n📊 ANALYSE DE LA BASE "devoirs" :\n');
        const db = client.db('devoirs');
        
        const collections = await db.listCollections().toArray();
        console.log(`   Collections trouvées : ${collections.length}\n`);
        
        for (const col of collections) {
            const collection = db.collection(col.name);
            const count = await collection.countDocuments();
            console.log(`   📁 ${col.name} : ${count} documents`);
            
            if (count > 0 && count <= 5) {
                const samples = await collection.find({}).limit(2).toArray();
                console.log(`      Exemples :`);
                samples.forEach(doc => {
                    const preview = JSON.stringify(doc, null, 2).substring(0, 200);
                    console.log(`      ${preview}...`);
                });
            }
            console.log('');
        }
        
    } catch (error) {
        console.error('\n❌ ERREUR :', error.message);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Connexion fermée\n');
        }
    }
}

console.log('═'.repeat(70));
console.log('  🔍 INSPECTION DE VOTRE VRAIE BASE MONGODB');
console.log('═'.repeat(70) + '\n');

checkRealDatabase();
