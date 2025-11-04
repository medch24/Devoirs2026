#!/usr/bin/env node

/**
 * Script pour mettre à jour les dates des devoirs dans MongoDB
 * Usage: node update-dates.js
 */

const { MongoClient } = require('mongodb');
const moment = require('moment');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ ERREUR : MONGODB_URI non définie');
    console.log('Définissez la variable d\'environnement :');
    console.log('export MONGODB_URI="votre_chaine_de_connexion"');
    process.exit(1);
}

async function updateDates() {
    let client;
    
    try {
        console.log('🔌 Connexion à MongoDB...\n');
        client = new MongoClient(uri);
        await client.connect();
        
        const db = client.db('devoirs');
        const collection = db.collection('plans');
        
        // Récupérer tous les devoirs
        const allPlans = await collection.find({}).toArray();
        console.log(`📊 ${allPlans.length} devoirs trouvés dans la base de données\n`);
        
        if (allPlans.length === 0) {
            console.log('⚠️  Aucun devoir à mettre à jour');
            return;
        }
        
        // Afficher les dates actuelles
        const uniqueDates = [...new Set(allPlans.map(p => p.Jour))].sort();
        console.log('📅 Dates actuelles dans la base :');
        uniqueDates.forEach(date => {
            const count = allPlans.filter(p => p.Jour === date).length;
            console.log(`   - ${date} : ${count} devoirs`);
        });
        
        console.log('\n🔄 Mise à jour des dates...\n');
        
        // Obtenir la date du lundi de la semaine en cours
        const today = moment();
        const currentMonday = today.clone().startOf('isoWeek');
        
        console.log(`📆 Semaine actuelle : du ${currentMonday.format('YYYY-MM-DD')} au ${currentMonday.clone().add(4, 'days').format('YYYY-MM-DD')}\n`);
        
        // Pour chaque date unique, calculer le décalage
        const dateMapping = {};
        
        uniqueDates.forEach((oldDate, index) => {
            const oldMoment = moment(oldDate);
            const dayOfWeek = oldMoment.day(); // 0 = dimanche, 1 = lundi, etc.
            
            // Calculer la nouvelle date dans la semaine actuelle
            let newDate;
            if (dayOfWeek === 0) { // Dimanche
                newDate = currentMonday.clone().subtract(1, 'day');
            } else if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Lundi à Jeudi
                newDate = currentMonday.clone().add(dayOfWeek - 1, 'days');
            } else {
                // Weekend (vendredi, samedi) - on met au jeudi
                newDate = currentMonday.clone().add(3, 'days');
            }
            
            dateMapping[oldDate] = newDate.format('YYYY-MM-DD');
            console.log(`   ${oldDate} → ${dateMapping[oldDate]} (${newDate.format('dddd')})`);
        });
        
        console.log('\n📝 Application des mises à jour...\n');
        
        let updatedCount = 0;
        for (const [oldDate, newDate] of Object.entries(dateMapping)) {
            const result = await collection.updateMany(
                { Jour: oldDate },
                { $set: { Jour: newDate } }
            );
            
            updatedCount += result.modifiedCount;
            console.log(`   ✅ ${result.modifiedCount} devoirs mis à jour : ${oldDate} → ${newDate}`);
        }
        
        console.log(`\n🎉 Mise à jour terminée !`);
        console.log(`   Total : ${updatedCount} devoirs mis à jour\n`);
        
        // Afficher les nouvelles dates
        const updatedPlans = await collection.find({}).toArray();
        const newUniqueDates = [...new Set(updatedPlans.map(p => p.Jour))].sort();
        
        console.log('📅 Nouvelles dates dans la base :');
        newUniqueDates.forEach(date => {
            const count = updatedPlans.filter(p => p.Jour === date).length;
            const dayName = moment(date).locale('fr').format('dddd D MMMM YYYY');
            console.log(`   - ${date} (${dayName}) : ${count} devoirs`);
        });
        
    } catch (error) {
        console.error('\n❌ ERREUR :', error.message);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('\n🔌 Connexion fermée\n');
        }
    }
}

// Exécution
console.log('🚀 Script de Mise à Jour des Dates - Devoirs2026\n');
console.log('=' .repeat(60) + '\n');

updateDates().catch(console.error);
