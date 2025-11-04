#!/usr/bin/env node

/**
 * Script pour charger les données de la base TEST (pas devoirs)
 * Base : test
 * Collection : plans (693 documents)
 */

const { MongoClient } = require('mongodb');
const https = require('https');

// URI vers la base TEST (pas devoirs)
const TEST_URI = "mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/test?retryWrites=true&w=majority";

async function getTestData() {
    let client;
    
    try {
        console.log('📥 Connexion à la base TEST...\n');
        client = new MongoClient(TEST_URI);
        await client.connect();
        
        const db = client.db('test');  // BASE = test
        const collection = db.collection('plans');
        
        const data = await collection.find({}).toArray();
        console.log(`✅ ${data.length} devoirs récupérés de test.plans\n`);
        
        // Statistiques
        const dates = [...new Set(data.map(d => d.Jour))].sort();
        console.log(`📅 Dates disponibles : ${dates.length}`);
        dates.slice(0, 10).forEach(date => {
            const count = data.filter(d => d.Jour === date).length;
            console.log(`   - ${date} : ${count} devoirs`);
        });
        if (dates.length > 10) {
            console.log(`   ... et ${dates.length - 10} autres dates`);
        }
        
        const teachers = [...new Set(data.map(d => d.Enseignant))];
        console.log(`\n👨‍🏫 Enseignants (${teachers.length}) : ${teachers.slice(0, 5).join(', ')}${teachers.length > 5 ? '...' : ''}`);
        
        const classes = [...new Set(data.map(d => d.Classe))];
        console.log(`📚 Classes : ${classes.join(', ')}\n`);
        
        // Nettoyer (enlever _id)
        const cleanData = data.map(({ _id, ...rest }) => rest);
        
        return cleanData;
        
    } catch (error) {
        console.error('❌ Erreur :', error.message);
        throw error;
    } finally {
        if (client) await client.close();
    }
}

async function uploadToAPI(data) {
    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(data);
        
        const options = {
            hostname: 'devoirs2026.vercel.app',
            port: 443,
            path: '/api/upload-plan',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataString)
            }
        };
        
        console.log('📤 Envoi vers l\'API Vercel...\n');
        
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(responseData));
                } catch (e) {
                    resolve({ message: responseData });
                }
            });
        });
        
        req.on('error', reject);
        req.write(dataString);
        req.end();
    });
}

async function syncTestDatabase() {
    try {
        console.log('╔' + '═'.repeat(68) + '╗');
        console.log('║                                                                    ║');
        console.log('║     🔄 CHARGEMENT DES DONNÉES DE LA BASE "TEST"                  ║');
        console.log('║                                                                    ║');
        console.log('╚' + '═'.repeat(68) + '╝\n');
        
        // Récupérer les données de test.plans
        const testData = await getTestData();
        
        console.log('📊 Échantillon des données :');
        testData.slice(0, 3).forEach(item => {
            console.log(`   ${item.Jour} | ${item.Classe} | ${item.Enseignant} | ${item.Matière}`);
            console.log(`      → ${item.Devoirs.substring(0, 60)}...`);
        });
        console.log('');
        
        // Envoyer à l'API
        const response = await uploadToAPI(testData);
        
        console.log('✅ Réponse API :', response.message);
        if (response.normalized) {
            console.log(`   📊 Normalisés : ${response.normalized}`);
            console.log(`   ⏭️  Ignorés : ${response.skipped || 0}`);
        }
        
        console.log('\n' + '═'.repeat(70));
        console.log('🎉 DONNÉES DE "TEST" CHARGÉES !');
        console.log('═'.repeat(70));
        console.log(`\n✅ ${testData.length} devoirs de test.plans maintenant dans l\'application`);
        console.log('\n🔍 Testez : https://devoirs2026.vercel.app/\n');
        
        console.log('💡 POUR UNE CONNEXION PERMANENTE :');
        console.log('   Changez MONGODB_URI dans Vercel :');
        console.log('   mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/test?retryWrites=true&w=majority');
        console.log('   (Changez /devoirs en /test)\n');
        
    } catch (error) {
        console.error('\n❌ ERREUR :', error.message);
        process.exit(1);
    }
}

syncTestDatabase();
