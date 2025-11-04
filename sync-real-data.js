#!/usr/bin/env node

/**
 * Script pour copier VOS VRAIES données vers l'application
 * depuis mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/
 */

const { MongoClient } = require('mongodb');
const https = require('https');

// VOTRE vraie URI MongoDB
const REAL_URI = "mongodb+srv://cherifmed2010:Mmedch86@devoirs.m5p4c1w.mongodb.net/devoirs?retryWrites=true&w=majority";

// API de destination
const API_URL = 'https://devoirs2026.vercel.app/api/upload-plan';

async function getRealData() {
    let client;
    
    try {
        console.log('📥 Récupération de VOS VRAIES données...\n');
        client = new MongoClient(REAL_URI);
        await client.connect();
        
        const db = client.db('devoirs');
        const collection = db.collection('plans');
        
        const data = await collection.find({}).toArray();
        console.log(`✅ ${data.length} devoirs récupérés de VOTRE base\n`);
        
        // Afficher quelques statistiques
        const dates = [...new Set(data.map(d => d.Jour))].sort();
        console.log(`📅 Dates disponibles : ${dates.length}`);
        dates.forEach(date => {
            const count = data.filter(d => d.Jour === date).length;
            console.log(`   - ${date} : ${count} devoirs`);
        });
        
        const teachers = [...new Set(data.map(d => d.Enseignant))];
        console.log(`\n👨‍🏫 Enseignants : ${teachers.join(', ')}\n`);
        
        // Nettoyer les données (enlever _id)
        const cleanData = data.map(({ _id, ...rest }) => rest);
        
        return cleanData;
        
    } catch (error) {
        console.error('❌ Erreur récupération :', error.message);
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

async function syncRealData() {
    try {
        console.log('╔' + '═'.repeat(68) + '╗');
        console.log('║                                                                    ║');
        console.log('║     🔄 SYNCHRONISATION DE VOS VRAIES DONNÉES                     ║');
        console.log('║                                                                    ║');
        console.log('╚' + '═'.repeat(68) + '╝\n');
        
        // Récupérer les vraies données
        const realData = await getRealData();
        
        // Envoyer à l'API
        const response = await uploadToAPI(realData);
        
        console.log('✅ Réponse API :', response.message);
        if (response.normalized) {
            console.log(`   📊 Normalisés : ${response.normalized}`);
            console.log(`   ⏭️  Ignorés : ${response.skipped || 0}`);
        }
        
        console.log('\n' + '═'.repeat(70));
        console.log('🎉 SYNCHRONISATION TERMINÉE !');
        console.log('═'.repeat(70));
        console.log('\n✅ VOS vraies données sont maintenant dans l\'application');
        console.log('✅ Total : ' + realData.length + ' devoirs');
        console.log('\n🔍 Testez : https://devoirs2026.vercel.app/\n');
        
        console.log('⚠️  NOTE IMPORTANTE :');
        console.log('    Pour une connexion DIRECTE permanente à VOTRE base,');
        console.log('    modifiez MONGODB_URI dans Vercel (voir UPDATE_MONGODB_URI.md)\n');
        
    } catch (error) {
        console.error('\n❌ ERREUR :', error.message);
        process.exit(1);
    }
}

syncRealData();
