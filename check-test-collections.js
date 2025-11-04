#!/usr/bin/env node

const { MongoClient } = require('mongodb');

const TEST_URI = "mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/test?retryWrites=true&w=majority";

async function checkTestCollections() {
    let client;
    
    try {
        console.log('🔌 Connexion à la base TEST...\n');
        client = new MongoClient(TEST_URI);
        await client.connect();
        
        const db = client.db('test');
        
        const collections = await db.listCollections().toArray();
        console.log(`📦 Collections dans "test" : ${collections.length}\n`);
        
        for (const col of collections) {
            const collection = db.collection(col.name);
            const count = await collection.countDocuments();
            console.log(`📁 ${col.name} : ${count} documents`);
            
            if (count > 0 && count <= 5) {
                const samples = await collection.find({}).limit(1).toArray();
                console.log(`   Exemple :`);
                console.log(`   ${JSON.stringify(samples[0], null, 2).substring(0, 300)}...`);
            }
            console.log('');
        }
        
        // Vérifier spécifiquement les évaluations
        console.log('═'.repeat(70));
        console.log('📊 ANALYSE DES ÉVALUATIONS\n');
        
        const evalCollection = db.collection('evaluations');
        const evalCount = await evalCollection.countDocuments();
        
        if (evalCount > 0) {
            console.log(`✅ ${evalCount} évaluations trouvées\n`);
            
            // Dates des évaluations
            const evalDates = await evalCollection.distinct('date');
            console.log(`📅 Dates avec évaluations : ${evalDates.length}`);
            evalDates.sort().slice(0, 10).forEach(date => {
                const count = evalCollection.countDocuments({ date });
                console.log(`   - ${date}`);
            });
            
            // Exemples d'évaluations
            console.log('\n📋 Exemples d\'évaluations :');
            const samples = await evalCollection.find({}).limit(3).toArray();
            samples.forEach(ev => {
                console.log(`\n   Date: ${ev.date} | Classe: ${ev.class} | Élève: ${ev.studentName}`);
                console.log(`   Matière: ${ev.subject} | Statut: ${ev.status}`);
                console.log(`   Participation: ${ev.participation} | Comportement: ${ev.behavior}`);
                if (ev.comment) console.log(`   Commentaire: ${ev.comment}`);
            });
        } else {
            console.log('⚠️  Aucune évaluation trouvée dans test.evaluations');
        }
        
    } catch (error) {
        console.error('\n❌ ERREUR :', error.message);
    } finally {
        if (client) await client.close();
    }
}

console.log('╔' + '═'.repeat(68) + '╗');
console.log('║  🔍 INSPECTION COMPLÈTE DE LA BASE TEST                          ║');
console.log('╚' + '═'.repeat(68) + '╝\n');

checkTestCollections();
