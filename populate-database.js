#!/usr/bin/env node

/**
 * 📚 SCRIPT DE PEUPLEMENT AUTOMATIQUE DE LA BASE DE DONNÉES
 * 
 * Ce script remplit MongoDB avec des devoirs pour la semaine actuelle
 * Format des dates : YYYY-MM-DD (standard)
 */

const { MongoClient } = require('mongodb');
const moment = require('moment');
require('moment/locale/fr');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ ERREUR : MONGODB_URI non définie');
    console.log('Définissez la variable d\'environnement :');
    console.log('export MONGODB_URI="votre_chaine_de_connexion"');
    process.exit(1);
}

// Données de planning pour la semaine
const planningData = [
    // Dimanche (2025-11-03)
    { Enseignant: "Mme Fatima", Jour: "2025-11-03", Classe: "PEI1", Matière: "Mathématiques", Devoirs: "Exercices 1 à 5 page 45" },
    { Enseignant: "M. Ahmed", Jour: "2025-11-03", Classe: "PEI1", Matière: "Français", Devoirs: "Lecture pages 12-15 + questions" },
    { Enseignant: "Mme Sarah", Jour: "2025-11-03", Classe: "PEI2", Matière: "Sciences", Devoirs: "Réviser chapitre 3" },
    { Enseignant: "M. Karim", Jour: "2025-11-03", Classe: "PEI2", Matière: "Histoire", Devoirs: "Recherche sur les pyramides" },
    { Enseignant: "Mme Nadia", Jour: "2025-11-03", Classe: "PEI3", Matière: "Anglais", Devoirs: "Vocabulaire leçon 4" },
    { Enseignant: "M. Youssef", Jour: "2025-11-03", Classe: "PEI3", Matière: "Géographie", Devoirs: "Carte de l'Afrique" },
    { Enseignant: "Mme Leila", Jour: "2025-11-03", Classe: "PEI4", Matière: "Physique", Devoirs: "Problèmes page 78" },
    { Enseignant: "M. Omar", Jour: "2025-11-03", Classe: "PEI4", Matière: "Chimie", Devoirs: "Réviser tableau périodique" },
    { Enseignant: "Mme Amina", Jour: "2025-11-03", Classe: "DP2", Matière: "Littérature", Devoirs: "Analyse de poème" },
    
    // Lundi (2025-11-04)
    { Enseignant: "Mme Fatima", Jour: "2025-11-04", Classe: "PEI1", Matière: "Mathématiques", Devoirs: "Exercices 6 à 10 page 46" },
    { Enseignant: "M. Ahmed", Jour: "2025-11-04", Classe: "PEI1", Matière: "Français", Devoirs: "Rédaction : Ma famille" },
    { Enseignant: "Mme Hiba", Jour: "2025-11-04", Classe: "PEI1", Matière: "العربية", Devoirs: "تمارين الصفحة 30-31" },
    { Enseignant: "Mme Sarah", Jour: "2025-11-04", Classe: "PEI2", Matière: "Sciences", Devoirs: "Expérience sur l'eau" },
    { Enseignant: "M. Karim", Jour: "2025-11-04", Classe: "PEI2", Matière: "Histoire", Devoirs: "Questions page 25" },
    { Enseignant: "Mme Nadia", Jour: "2025-11-04", Classe: "PEI3", Matière: "Anglais", Devoirs: "Exercices grammar unit 5" },
    { Enseignant: "M. Youssef", Jour: "2025-11-04", Classe: "PEI3", Matière: "Géographie", Devoirs: "Capitales d'Europe" },
    { Enseignant: "Mme Leila", Jour: "2025-11-04", Classe: "PEI4", Matière: "Physique", Devoirs: "Exercices sur la vitesse" },
    { Enseignant: "M. Omar", Jour: "2025-11-04", Classe: "PEI4", Matière: "Chimie", Devoirs: "Réviser les réactions" },
    { Enseignant: "Mme Amina", Jour: "2025-11-04", Classe: "DP2", Matière: "Littérature", Devoirs: "Lire chapitre 5" },
    
    // Mardi (2025-11-05)
    { Enseignant: "Mme Fatima", Jour: "2025-11-05", Classe: "PEI1", Matière: "Mathématiques", Devoirs: "Problèmes page 48" },
    { Enseignant: "M. Ahmed", Jour: "2025-11-05", Classe: "PEI1", Matière: "Français", Devoirs: "Conjugaison : présent" },
    { Enseignant: "Mme Hiba", Jour: "2025-11-05", Classe: "PEI1", Matière: "العربية", Devoirs: "قراءة النص صفحة 35" },
    { Enseignant: "Mme Sarah", Jour: "2025-11-05", Classe: "PEI2", Matière: "Sciences", Devoirs: "Résumé chapitre 4" },
    { Enseignant: "M. Karim", Jour: "2025-11-05", Classe: "PEI2", Matière: "Histoire", Devoirs: "Frise chronologique" },
    { Enseignant: "Mme Nadia", Jour: "2025-11-05", Classe: "PEI3", Matière: "Anglais", Devoirs: "Writing exercise p.42" },
    { Enseignant: "M. Youssef", Jour: "2025-11-05", Classe: "PEI3", Matière: "Géographie", Devoirs: "Relief d'Asie" },
    { Enseignant: "Mme Leila", Jour: "2025-11-05", Classe: "PEI4", Matière: "Physique", Devoirs: "Lois de Newton" },
    { Enseignant: "M. Omar", Jour: "2025-11-05", Classe: "PEI4", Matière: "Chimie", Devoirs: "Exercices acides/bases" },
    { Enseignant: "Mme Amina", Jour: "2025-11-05", Classe: "DP2", Matière: "Littérature", Devoirs: "Commentaire de texte" },
    
    // Mercredi (2025-11-06)
    { Enseignant: "Mme Fatima", Jour: "2025-11-06", Classe: "PEI1", Matière: "Mathématiques", Devoirs: "Réviser tables multiplication" },
    { Enseignant: "M. Ahmed", Jour: "2025-11-06", Classe: "PEI1", Matière: "Français", Devoirs: "Dictée préparatoire" },
    { Enseignant: "Mme Hiba", Jour: "2025-11-06", Classe: "PEI1", Matière: "العربية", Devoirs: "الإملاء صفحة 40" },
    { Enseignant: "Mme Sarah", Jour: "2025-11-06", Classe: "PEI2", Matière: "Sciences", Devoirs: "Préparer exposé" },
    { Enseignant: "M. Karim", Jour: "2025-11-06", Classe: "PEI2", Matière: "Histoire", Devoirs: "Réviser pour contrôle" },
    { Enseignant: "Mme Nadia", Jour: "2025-11-06", Classe: "PEI3", Matière: "Anglais", Devoirs: "Reading comprehension" },
    { Enseignant: "M. Youssef", Jour: "2025-11-06", Classe: "PEI3", Matière: "Géographie", Devoirs: "Océans et mers" },
    { Enseignant: "Mme Leila", Jour: "2025-11-06", Classe: "PEI4", Matière: "Physique", Devoirs: "Préparer TP électricité" },
    { Enseignant: "M. Omar", Jour: "2025-11-06", Classe: "PEI4", Matière: "Chimie", Devoirs: "Réviser nomenclature" },
    { Enseignant: "Mme Amina", Jour: "2025-11-06", Classe: "DP2", Matière: "Littérature", Devoirs: "Fiche de lecture" },
    
    // Jeudi (2025-11-07)
    { Enseignant: "Mme Fatima", Jour: "2025-11-07", Classe: "PEI1", Matière: "Mathématiques", Devoirs: "Contrôle : réviser tout" },
    { Enseignant: "M. Ahmed", Jour: "2025-11-07", Classe: "PEI1", Matière: "Français", Devoirs: "Production écrite" },
    { Enseignant: "Mme Hiba", Jour: "2025-11-07", Classe: "PEI1", Matière: "العربية", Devoirs: "مراجعة شاملة" },
    { Enseignant: "Mme Sarah", Jour: "2025-11-07", Classe: "PEI2", Matière: "Sciences", Devoirs: "Questions de synthèse" },
    { Enseignant: "M. Karim", Jour: "2025-11-07", Classe: "PEI2", Matière: "Histoire", Devoirs: "Contrôle demain" },
    { Enseignant: "Mme Nadia", Jour: "2025-11-07", Classe: "PEI3", Matière: "Anglais", Devoirs: "Réviser verbes irréguliers" },
    { Enseignant: "M. Youssef", Jour: "2025-11-07", Classe: "PEI3", Matière: "Géographie", Devoirs: "Climat mondial" },
    { Enseignant: "Mme Leila", Jour: "2025-11-07", Classe: "PEI4", Matière: "Physique", Devoirs: "Révision générale" },
    { Enseignant: "M. Omar", Jour: "2025-11-07", Classe: "PEI4", Matière: "Chimie", Devoirs: "Préparer contrôle" },
    { Enseignant: "Mme Amina", Jour: "2025-11-07", Classe: "DP2", Matière: "Littérature", Devoirs: "Dissertation" }
];

async function populateDatabase() {
    let client;
    
    try {
        console.log('🔌 Connexion à MongoDB...\n');
        client = new MongoClient(uri);
        await client.connect();
        
        const db = client.db('devoirs');
        const collection = db.collection('plans');
        
        // Vérifier le nombre actuel de documents
        const currentCount = await collection.countDocuments();
        console.log(`📊 Documents actuels dans la base : ${currentCount}\n`);
        
        if (currentCount > 0) {
            console.log('⚠️  La base contient déjà des données.');
            console.log('Options :');
            console.log('   1. Supprimer et remplacer par de nouvelles données');
            console.log('   2. Ajouter sans supprimer\n');
            
            // Pour automatisation, on supprime et remplace
            console.log('🗑️  Suppression des anciennes données...');
            const deleteResult = await collection.deleteMany({});
            console.log(`✅ ${deleteResult.deletedCount} documents supprimés\n`);
        }
        
        console.log('📝 Insertion de nouveaux devoirs...\n');
        console.log(`   Nombre de devoirs à insérer : ${planningData.length}`);
        
        // Calculer la date actuelle et afficher la semaine
        const today = moment();
        const weekStart = moment('2025-11-03');
        const weekEnd = moment('2025-11-07');
        
        console.log(`   Période : ${weekStart.format('dddd D MMMM')} au ${weekEnd.format('dddd D MMMM YYYY')}\n`);
        
        // Grouper par date
        const byDate = {};
        planningData.forEach(item => {
            if (!byDate[item.Jour]) byDate[item.Jour] = [];
            byDate[item.Jour].push(item);
        });
        
        console.log('📅 Répartition par jour :');
        Object.entries(byDate).forEach(([date, items]) => {
            const dayName = moment(date).locale('fr').format('dddd D MMMM');
            console.log(`   - ${date} (${dayName}) : ${items.length} devoirs`);
        });
        
        console.log('\n💾 Insertion dans MongoDB...\n');
        
        // Insérer avec upsert pour éviter les doublons
        const operations = planningData.map(plan => ({
            updateOne: {
                filter: { Jour: plan.Jour, Classe: plan.Classe, Matière: plan.Matière },
                update: { $set: plan },
                upsert: true
            }
        }));
        
        const result = await collection.bulkWrite(operations);
        
        console.log('✅ Insertion terminée !');
        console.log(`   - Documents insérés : ${result.upsertedCount}`);
        console.log(`   - Documents modifiés : ${result.modifiedCount}`);
        console.log(`   - Total traité : ${result.upsertedCount + result.modifiedCount}\n`);
        
        // Vérification finale
        const finalCount = await collection.countDocuments();
        const teachers = await collection.distinct('Enseignant');
        const classes = await collection.distinct('Classe');
        
        console.log('📊 État final de la base :');
        console.log(`   - Total devoirs : ${finalCount}`);
        console.log(`   - Enseignants : ${teachers.length} (${teachers.join(', ')})`);
        console.log(`   - Classes : ${classes.length} (${classes.join(', ')})`);
        
        console.log('\n🎉 Base de données peuplée avec succès !\n');
        console.log('🔍 Vérification :');
        console.log('   1. MongoDB Atlas : https://cloud.mongodb.com/');
        console.log('   2. Application : https://devoirs2026.vercel.app/');
        console.log('   3. API : https://devoirs2026.vercel.app/api/initial-data\n');
        
    } catch (error) {
        console.error('\n❌ ERREUR :', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Connexion MongoDB fermée\n');
        }
    }
}

// Exécution
console.log('\n');
console.log('╔' + '═'.repeat(68) + '╗');
console.log('║' + ' '.repeat(68) + '║');
console.log('║     📚 PEUPLEMENT AUTOMATIQUE DE LA BASE DE DONNÉES             ║');
console.log('║' + ' '.repeat(68) + '║');
console.log('║              Devoirs2026 - Semaine Actuelle                      ║');
console.log('║' + ' '.repeat(68) + '║');
console.log('╚' + '═'.repeat(68) + '╝');
console.log('\n');

populateDatabase().catch(error => {
    console.error('❌ Erreur fatale :', error);
    process.exit(1);
});
