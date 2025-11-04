#!/usr/bin/env node

/**
 * Script pour lister toutes les dates disponibles dans la base de données
 */

const https = require('https');

async function fetchData() {
    return new Promise((resolve, reject) => {
        https.get('https://devoirs2026.vercel.app/api/initial-data', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function listAllDates() {
    try {
        console.log('📊 Récupération des données...\n');
        
        const data = await fetchData();
        
        if (!data.planData || data.planData.length === 0) {
            console.log('❌ Aucune donnée trouvée dans la base');
            return;
        }
        
        console.log(`✅ ${data.planData.length} devoirs trouvés\n`);
        
        // Extraire toutes les dates uniques
        const dates = [...new Set(data.planData.map(item => item.Jour))].sort();
        
        console.log('📅 DATES DISPONIBLES DANS LA BASE DE DONNÉES :\n');
        dates.forEach((date, index) => {
            const count = data.planData.filter(item => item.Jour === date).length;
            const dayName = new Date(date).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            console.log(`   ${index + 1}. ${date} (${dayName}) - ${count} devoirs`);
        });
        
        // Classes disponibles
        const classes = [...new Set(data.planData.map(item => item.Classe))].sort();
        console.log(`\n📚 CLASSES DISPONIBLES : ${classes.join(', ')}`);
        
        // Enseignants disponibles
        console.log(`\n👨‍🏫 ENSEIGNANTS DISPONIBLES :`);
        data.teachers.forEach((teacher, index) => {
            const count = data.planData.filter(item => item.Enseignant === teacher).length;
            console.log(`   ${index + 1}. ${teacher} (${count} devoirs)`);
        });
        
        // Matières disponibles
        const subjects = [...new Set(data.planData.map(item => item.Matière))].sort();
        console.log(`\n📖 MATIÈRES DISPONIBLES :`);
        subjects.forEach((subject, index) => {
            const count = data.planData.filter(item => item.Matière === subject).length;
            console.log(`   ${index + 1}. ${subject} (${count} devoirs)`);
        });
        
        console.log('\n' + '='.repeat(70));
        console.log('💡 RECOMMANDATION :');
        console.log('='.repeat(70));
        console.log('\nVotre base contient des devoirs de septembre 2025.');
        console.log('L\'application cherche les devoirs de la semaine actuelle (novembre).\n');
        console.log('🔧 SOLUTIONS :');
        console.log('   1. Ajouter un sélecteur de date dans l\'interface');
        console.log('   2. Mettre à jour les dates vers la semaine actuelle');
        console.log('   3. Permettre la navigation entre toutes les semaines\n');
        
    } catch (error) {
        console.error('❌ ERREUR :', error.message);
    }
}

console.log('╔' + '═'.repeat(68) + '╗');
console.log('║  📊 ANALYSE DES DONNÉES DE LA BASE - Devoirs2026              ║');
console.log('╚' + '═'.repeat(68) + '╝\n');

listAllDates();
