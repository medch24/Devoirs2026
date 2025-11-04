#!/usr/bin/env node

/**
 * 🌍 SCRIPT UNIVERSEL DE NORMALISATION DES DATES
 * 
 * Ce script convertit TOUS les formats de dates en YYYY-MM-DD
 * Support pour :
 * - Chiffres arabes : ٠١٢٣٤٥٦٧٨٩
 * - Chiffres latins : 0123456789
 * - Formats : jj/mm/aaaa, mm/jj/aaaa, yyyy-mm-dd, dd-mm-yyyy, etc.
 * - Dates françaises : 15 novembre 2025
 * - Timestamps et formats ISO
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

/**
 * 🔢 Convertir les chiffres arabes en chiffres latins
 */
function convertArabicToLatin(str) {
    const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
    const latinNumerals = '0123456789';
    
    let result = str;
    for (let i = 0; i < arabicNumerals.length; i++) {
        result = result.replace(new RegExp(arabicNumerals[i], 'g'), latinNumerals[i]);
    }
    return result;
}

/**
 * 📅 Parser intelligent de dates - supporte TOUS les formats
 */
function parseUniversalDate(dateStr) {
    if (!dateStr) return null;
    
    // Convertir en string si nécessaire
    dateStr = String(dateStr).trim();
    
    // Convertir les chiffres arabes en latins
    dateStr = convertArabicToLatin(dateStr);
    
    // Si c'est déjà au format YYYY-MM-DD valide, retourner tel quel
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const testDate = moment(dateStr, 'YYYY-MM-DD', true);
        if (testDate.isValid()) {
            return dateStr;
        }
    }
    
    // Liste des formats à essayer (du plus spécifique au plus général)
    const formats = [
        // Formats ISO et standards
        'YYYY-MM-DD',
        'YYYY/MM/DD',
        'YYYY.MM.DD',
        
        // Formats européens (jour en premier)
        'DD/MM/YYYY',
        'DD-MM-YYYY',
        'DD.MM.YYYY',
        'DD/MM/YY',
        'DD-MM-YY',
        
        // Formats américains (mois en premier)
        'MM/DD/YYYY',
        'MM-DD-YYYY',
        'MM.DD.YYYY',
        'MM/DD/YY',
        'MM-DD-YY',
        
        // Formats avec texte
        'DD MMMM YYYY',
        'DD MMM YYYY',
        'D MMMM YYYY',
        'D MMM YYYY',
        'MMMM DD, YYYY',
        'MMM DD, YYYY',
        
        // Formats compacts
        'DDMMYYYY',
        'YYYYMMDD',
        
        // ISO avec heure
        moment.ISO_8601
    ];
    
    // Essayer tous les formats en français et anglais
    for (const format of formats) {
        // Français
        let parsed = moment(dateStr, format, 'fr', true);
        if (parsed.isValid()) {
            return parsed.format('YYYY-MM-DD');
        }
        
        // Anglais
        parsed = moment(dateStr, format, 'en', true);
        if (parsed.isValid()) {
            return parsed.format('YYYY-MM-DD');
        }
        
        // Sans spécification de locale
        parsed = moment(dateStr, format, true);
        if (parsed.isValid()) {
            return parsed.format('YYYY-MM-DD');
        }
    }
    
    // Dernier recours : parsing automatique
    const autoParsed = moment(dateStr);
    if (autoParsed.isValid()) {
        return autoParsed.format('YYYY-MM-DD');
    }
    
    // Si rien ne fonctionne, retourner null
    console.warn(`⚠️  Impossible de parser la date : "${dateStr}"`);
    return null;
}

/**
 * 🔄 Normaliser toutes les dates dans la collection
 */
async function normalizeDates() {
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
            console.log('⚠️  Aucun devoir à normaliser');
            return;
        }
        
        // Afficher les dates actuelles
        const uniqueDates = [...new Set(allPlans.map(p => p.Jour))].filter(Boolean).sort();
        console.log('📅 Formats de dates actuels :');
        uniqueDates.forEach(date => {
            const count = allPlans.filter(p => p.Jour === date).length;
            console.log(`   - "${date}" : ${count} devoirs`);
        });
        
        console.log('\n🔄 Normalisation en cours...\n');
        
        let successCount = 0;
        let errorCount = 0;
        const updates = [];
        
        // Parser et normaliser chaque date
        for (const plan of allPlans) {
            const originalDate = plan.Jour;
            
            if (!originalDate) {
                console.warn(`⚠️  Document sans date (ID: ${plan._id})`);
                errorCount++;
                continue;
            }
            
            const normalizedDate = parseUniversalDate(originalDate);
            
            if (normalizedDate && normalizedDate !== originalDate) {
                updates.push({
                    _id: plan._id,
                    oldDate: originalDate,
                    newDate: normalizedDate
                });
                successCount++;
            } else if (!normalizedDate) {
                console.error(`❌ Échec parsing : "${originalDate}" (ID: ${plan._id})`);
                errorCount++;
            }
        }
        
        // Afficher un résumé des conversions
        if (updates.length > 0) {
            console.log('📝 Conversions prévues :\n');
            const conversionSummary = {};
            updates.forEach(u => {
                const key = `${u.oldDate} → ${u.newDate}`;
                conversionSummary[key] = (conversionSummary[key] || 0) + 1;
            });
            
            Object.entries(conversionSummary).forEach(([conversion, count]) => {
                console.log(`   ${conversion} (${count} devoirs)`);
            });
            
            console.log('\n💾 Application des mises à jour...\n');
            
            // Appliquer les mises à jour par batch
            let updatedCount = 0;
            for (const update of updates) {
                const result = await collection.updateOne(
                    { _id: update._id },
                    { $set: { Jour: update.newDate } }
                );
                
                if (result.modifiedCount > 0) {
                    updatedCount++;
                }
            }
            
            console.log(`✅ ${updatedCount} devoirs normalisés avec succès`);
        } else {
            console.log('✅ Toutes les dates sont déjà au format standard YYYY-MM-DD');
        }
        
        if (errorCount > 0) {
            console.log(`⚠️  ${errorCount} dates n'ont pas pu être normalisées`);
        }
        
        // Afficher les nouvelles dates
        console.log('\n📅 Dates après normalisation :');
        const updatedPlans = await collection.find({}).toArray();
        const newUniqueDates = [...new Set(updatedPlans.map(p => p.Jour))].filter(Boolean).sort();
        
        newUniqueDates.forEach(date => {
            const count = updatedPlans.filter(p => p.Jour === date).length;
            const dayName = moment(date).locale('fr').format('dddd D MMMM YYYY');
            console.log(`   - ${date} (${dayName}) : ${count} devoirs`);
        });
        
        console.log('\n🎉 Normalisation terminée !\n');
        
    } catch (error) {
        console.error('\n❌ ERREUR :', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Connexion fermée\n');
        }
    }
}

// Exécution
console.log('🌍 Script Universel de Normalisation des Dates - Devoirs2026\n');
console.log('=' .repeat(70) + '\n');

normalizeDates().catch(console.error);
