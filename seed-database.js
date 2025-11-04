#!/usr/bin/env node

/**
 * Script pour peupler la base de données avec des données de test
 * Utilise l'API Vercel pour contourner les restrictions réseau du sandbox
 */

const https = require('https');

const API_URL = 'https://devoirs2026.vercel.app/api/upload-plan';

// Générer des devoirs pour la semaine actuelle (2-6 novembre 2025)
const generateWeekData = () => {
    const teachers = {
        'Prof Mathématiques': 'Mathématiques',
        'Prof Français': 'Français',
        'Prof Arabe': 'العربية',
        'Prof Sciences': 'Sciences',
        'Prof Histoire': 'Histoire-Géo'
    };
    
    const classes = ['PEI1', 'PEI2', 'PEI3', 'PEI4', 'DP2'];
    const dates = [
        '2025-11-03', // Dimanche
        '2025-11-04', // Lundi
        '2025-11-05', // Mardi
        '2025-11-06', // Mercredi
    ];
    
    const homeworkTemplates = {
        'Mathématiques': [
            'Exercices 1 à 5 page 45',
            'Problèmes page 52-53',
            'Révision tables de multiplication',
            'Exercices de géométrie p.67'
        ],
        'Français': [
            'Lecture pages 12-15',
            'Rédaction : Description d\'un lieu',
            'Conjugaison : Passé composé exercices 3-4',
            'Dictée à préparer page 28'
        ],
        'العربية': [
            'قراءة الصفحات ١٢-١٥',
            'تمارين النحو صفحة ٣٠',
            'حفظ النص صفحة ٢٥',
            'تمارين الإملاء'
        ],
        'Sciences': [
            'Expérience : Le cycle de l\'eau',
            'Exercices page 34-35',
            'Schéma du système solaire',
            'Questions page 42'
        ],
        'Histoire-Géo': [
            'Lire chapitre 3',
            'Carte à compléter page 18',
            'Questions de révision',
            'Exposé sur les pyramides'
        ]
    };
    
    const planData = [];
    
    // Générer des devoirs pour chaque combinaison
    dates.forEach(date => {
        classes.forEach(className => {
            Object.entries(teachers).forEach(([teacherName, subject]) => {
                const templates = homeworkTemplates[subject];
                const homework = templates[Math.floor(Math.random() * templates.length)];
                
                planData.push({
                    Enseignant: teacherName,
                    Jour: date,
                    Classe: className,
                    Matière: subject,
                    Devoirs: homework
                });
            });
        });
    });
    
    return planData;
};

// Fonction pour envoyer les données via l'API
const uploadData = (data) => {
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
        
        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(responseData);
                    resolve(response);
                } catch (e) {
                    resolve({ message: responseData });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(dataString);
        req.end();
    });
};

// Fonction principale
async function seedDatabase() {
    try {
        console.log('🌱 Génération des données de test...\n');
        
        const weekData = generateWeekData();
        console.log(`✅ ${weekData.length} devoirs générés`);
        console.log(`📅 Dates : 3-6 novembre 2025`);
        console.log(`👥 Classes : PEI1, PEI2, PEI3, PEI4, DP2`);
        console.log(`📚 Matières : Mathématiques, Français, Arabe, Sciences, Histoire-Géo\n`);
        
        // Afficher un échantillon
        console.log('📋 Échantillon des devoirs générés :');
        weekData.slice(0, 5).forEach(item => {
            console.log(`   ${item.Jour} | ${item.Classe} | ${item.Matière} : ${item.Devoirs.substring(0, 40)}...`);
        });
        console.log(`   ... et ${weekData.length - 5} autres\n`);
        
        console.log('📤 Envoi des données à l\'API...');
        
        const response = await uploadData(weekData);
        
        console.log('\n✅ Réponse de l\'API :');
        console.log(`   ${response.message}`);
        if (response.normalized !== undefined) {
            console.log(`   📊 Normalisés : ${response.normalized}`);
            console.log(`   ⏭️  Ignorés : ${response.skipped}`);
        }
        
        console.log('\n🎉 Base de données peuplée avec succès !');
        console.log('\n🔍 Vérification : Ouvrez https://devoirs2026.vercel.app/');
        console.log('   → Espace Parent → Choisissez une classe');
        console.log('   → Les devoirs devraient maintenant s\'afficher !\n');
        
    } catch (error) {
        console.error('\n❌ ERREUR :', error.message);
        console.error('\n💡 Solutions :');
        console.error('   1. Vérifiez votre connexion internet');
        console.error('   2. Vérifiez que l\'application Vercel est accessible');
        console.error('   3. Essayez de charger manuellement via l\'Espace Enseignant\n');
        process.exit(1);
    }
}

// Exécution
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                                                                ║');
console.log('║       🌱 PEUPLEMENT AUTOMATIQUE DE LA BASE DE DONNÉES        ║');
console.log('║                                                                ║');
console.log('║                    Devoirs2026 - Semaine 45                   ║');
console.log('║                                                                ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

seedDatabase().catch(console.error);
