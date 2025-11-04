#!/usr/bin/env node

/**
 * 🚀 SOLUTION COMPLÈTE : NORMALISATION + MISE À JOUR DES DATES
 * 
 * Ce script fait TOUT en une seule exécution :
 * 1. Convertit tous les formats de dates en YYYY-MM-DD
 * 2. Met à jour les dates vers la semaine actuelle
 * 
 * Support universel :
 * - Chiffres arabes : ٠١٢٣٤٥٦٧٨٩
 * - Chiffres latins : 0123456789
 * - Formats : jj/mm/aaaa, mm/jj/aaaa, yyyy-mm-dd, etc.
 * - Dates textuelles françaises et anglaises
 */

const { MongoClient } = require('mongodb');
const moment = require('moment');
require('moment/locale/fr');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ ERREUR : MONGODB_URI non définie');
    console.log('\nDéfinissez la variable d\'environnement :');
    console.log('export MONGODB_URI="mongodb+srv://username:password@host/devoirs?retryWrites=true&w=majority"');
    process.exit(1);
}

// ============================================================================
// ÉTAPE 1 : NORMALISATION DES FORMATS DE DATES
// ============================================================================

/**
 * 🔢 Convertir les chiffres arabes en chiffres latins
 */
function convertArabicToLatin(str) {
    const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
    const latinNumerals = '0123456789';
    
    let result = String(str);
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
    
    // Convertir en string et nettoyer
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
    
    // Liste exhaustive des formats à essayer
    const formats = [
        // ISO et standards
        'YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY.MM.DD',
        
        // Formats européens (jour en premier)
        'DD/MM/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY',
        'DD/MM/YY', 'DD-MM-YY', 'DD.MM.YY',
        
        // Formats américains (mois en premier)
        'MM/DD/YYYY', 'MM-DD-YYYY', 'MM.DD.YYYY',
        'MM/DD/YY', 'MM-DD-YY', 'MM.DD.YY',
        
        // Formats avec texte (français)
        'DD MMMM YYYY', 'D MMMM YYYY',
        'DD MMM YYYY', 'D MMM YYYY',
        'DD/MM/YYYY', 'D/M/YYYY',
        
        // Formats avec texte (anglais)
        'MMMM DD, YYYY', 'MMM DD, YYYY',
        'DD MMMM YYYY', 'DD MMM YYYY',
        
        // Formats compacts
        'DDMMYYYY', 'YYYYMMDD',
        
        // ISO avec heure
        moment.ISO_8601
    ];
    
    // Essayer tous les formats
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
        
        // Sans locale
        parsed = moment(dateStr, format, true);
        if (parsed.isValid()) {
            return parsed.format('YYYY-MM-DD');
        }
    }
    
    // Dernier recours : parsing automatique
    const autoParsed = moment(dateStr);
    if (autoParsed.isValid() && autoParsed.year() > 2000 && autoParsed.year() < 2100) {
        return autoParsed.format('YYYY-MM-DD');
    }
    
    return null;
}

// ============================================================================
// ÉTAPE 2 : MISE À JOUR VERS LA SEMAINE ACTUELLE
// ============================================================================

/**
 * 📆 Mapper une date vers la semaine actuelle (en préservant le jour de la semaine)
 */
function mapToCurrentWeek(dateStr) {
    const date = moment(dateStr, 'YYYY-MM-DD');
    if (!date.isValid()) return null;
    
    const today = moment();
    const currentMonday = today.clone().startOf('isoWeek');
    
    const dayOfWeek = date.day(); // 0 = dimanche, 1 = lundi, etc.
    
    let newDate;
    if (dayOfWeek === 0) { // Dimanche
        newDate = currentMonday.clone().subtract(1, 'day');
    } else if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Lundi à Jeudi
        newDate = currentMonday.clone().add(dayOfWeek - 1, 'days');
    } else { // Weekend (vendredi, samedi) - mettre au jeudi
        newDate = currentMonday.clone().add(3, 'days');
    }
    
    return newDate.format('YYYY-MM-DD');
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixAllDates() {
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
            console.log('⚠️  Aucun devoir trouvé');
            return;
        }
        
        // Afficher les dates actuelles
        const uniqueDates = [...new Set(allPlans.map(p => p.Jour))].filter(Boolean).sort();
        console.log('📅 Dates ACTUELLES dans la base :');
        uniqueDates.forEach(date => {
            const count = allPlans.filter(p => p.Jour === date).length;
            console.log(`   - "${date}" : ${count} devoirs`);
        });
        
        console.log('\n' + '='.repeat(70));
        console.log('🔄 ÉTAPE 1 : NORMALISATION DES FORMATS');
        console.log('='.repeat(70) + '\n');
        
        let normalizedCount = 0;
        let parseErrors = 0;
        const normalizedDates = new Map();
        
        // Normaliser toutes les dates
        for (const plan of allPlans) {
            const originalDate = plan.Jour;
            
            if (!originalDate) {
                console.warn(`⚠️  Document sans date (ID: ${plan._id})`);
                parseErrors++;
                continue;
            }
            
            const normalized = parseUniversalDate(originalDate);
            
            if (normalized) {
                normalizedDates.set(plan._id.toString(), {
                    _id: plan._id,
                    original: originalDate,
                    normalized: normalized,
                    teacher: plan.Enseignant,
                    class: plan.Classe,
                    subject: plan.Matière
                });
                
                if (normalized !== originalDate) {
                    normalizedCount++;
                }
            } else {
                console.error(`❌ Impossible de parser : "${originalDate}" (ID: ${plan._id})`);
                parseErrors++;
            }
        }
        
        console.log(`✅ ${normalizedCount} dates converties au format standard`);
        console.log(`✅ ${normalizedDates.size - normalizedCount} dates déjà au bon format`);
        if (parseErrors > 0) {
            console.log(`❌ ${parseErrors} dates non parsables (seront ignorées)`);
        }
        
        console.log('\n' + '='.repeat(70));
        console.log('🔄 ÉTAPE 2 : MISE À JOUR VERS LA SEMAINE ACTUELLE');
        console.log('='.repeat(70) + '\n');
        
        const today = moment();
        const currentMonday = today.clone().startOf('isoWeek');
        const currentThursday = currentMonday.clone().add(3, 'days');
        
        console.log(`📆 Semaine actuelle : ${currentMonday.format('dddd D MMMM')} au ${currentThursday.format('dddd D MMMM YYYY')}\n`);
        
        let updatedCount = 0;
        const dateMapping = new Map();
        
        // Mapper chaque date normalisée vers la semaine actuelle
        for (const [id, data] of normalizedDates) {
            const newDate = mapToCurrentWeek(data.normalized);
            
            if (newDate && newDate !== data.normalized) {
                dateMapping.set(id, {
                    ...data,
                    final: newDate
                });
            } else if (newDate) {
                // Date déjà dans la semaine actuelle
                dateMapping.set(id, {
                    ...data,
                    final: newDate
                });
            }
        }
        
        // Afficher un résumé des conversions
        console.log('📝 Résumé des transformations :\n');
        const transformationSummary = {};
        
        for (const [id, data] of dateMapping) {
            const key = `${data.original} → ${data.normalized} → ${data.final}`;
            if (!transformationSummary[key]) {
                transformationSummary[key] = [];
            }
            transformationSummary[key].push(data);
        }
        
        for (const [transformation, dataArray] of Object.entries(transformationSummary)) {
            console.log(`   ${transformation} (${dataArray.length} devoirs)`);
        }
        
        console.log('\n💾 Application des mises à jour...\n');
        
        // Appliquer toutes les mises à jour
        for (const [id, data] of dateMapping) {
            const result = await collection.updateOne(
                { _id: data._id },
                { $set: { Jour: data.final } }
            );
            
            if (result.modifiedCount > 0) {
                updatedCount++;
            }
        }
        
        console.log(`✅ ${updatedCount} devoirs mis à jour avec succès\n`);
        
        // Afficher les dates finales
        console.log('='.repeat(70));
        console.log('📅 DATES FINALES (après traitement complet)');
        console.log('='.repeat(70) + '\n');
        
        const finalPlans = await collection.find({}).toArray();
        const finalUniqueDates = [...new Set(finalPlans.map(p => p.Jour))].filter(Boolean).sort();
        
        finalUniqueDates.forEach(date => {
            const count = finalPlans.filter(p => p.Jour === date).length;
            const dayName = moment(date).locale('fr').format('dddd D MMMM YYYY');
            console.log(`   - ${date} (${dayName}) : ${count} devoirs`);
        });
        
        console.log('\n🎉 TRAITEMENT TERMINÉ AVEC SUCCÈS !\n');
        console.log('✅ Toutes les dates sont maintenant :');
        console.log('   1. Au format standard YYYY-MM-DD');
        console.log('   2. Dans la semaine actuelle');
        console.log('\n🔍 Vous pouvez maintenant tester votre application !\n');
        
    } catch (error) {
        console.error('\n❌ ERREUR CRITIQUE :', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Connexion MongoDB fermée\n');
        }
    }
}

// ============================================================================
// EXÉCUTION
// ============================================================================

console.log('\n');
console.log('╔' + '═'.repeat(68) + '╗');
console.log('║' + ' '.repeat(68) + '║');
console.log('║     🚀 SOLUTION COMPLÈTE : NORMALISATION + MISE À JOUR DATES     ║');
console.log('║' + ' '.repeat(68) + '║');
console.log('║              Devoirs2026 - Tous Formats Supportés                ║');
console.log('║' + ' '.repeat(68) + '║');
console.log('╚' + '═'.repeat(68) + '╝');
console.log('\n');

fixAllDates().catch(error => {
    console.error('❌ Erreur fatale :', error);
    process.exit(1);
});
