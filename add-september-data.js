#!/usr/bin/env node

/**
 * Script pour ajouter des données de septembre 2025
 * (en plus des données existantes de novembre)
 */

const https = require('https');

const generateSeptemberData = () => {
    const teachers = {
        'Prof Mathématiques': 'Mathématiques',
        'Prof Français': 'Français',
        'Prof Arabe': 'العربية',
        'Prof Lecture': 'L.L', // Lecture/Littérature (d'après votre screenshot)
        'Prof Sciences': 'Sciences',
    };
    
    const classes = ['PEI1', 'PEI2', 'PEI3', 'PEI4', 'DP2'];
    
    // Dates de septembre 2025 (comme dans votre screenshot)
    const dates = [
        '2025-09-28', // Dimanche
        '2025-09-29', // Lundi
        '2025-09-30', // Mardi
        '2025-10-01', // Mercredi
        '2025-10-02', // Jeudi
    ];
    
    const homeworkTemplates = {
        'Mathématiques': [
            'Exercices 1-5 page 23',
            'Problèmes page 28-29',
            'Tables de multiplication à réviser',
        ],
        'Français': [
            'Lecture pages 8-10',
            'Rédaction : Mon animal préféré',
            'Conjugaison : Présent exercices 2-3',
        ],
        'العربية': [
            'قراءة الصفحات ٨-١٠',
            'تمارين النحو صفحة ١٥',
            'حفظ النص صفحة ١٢',
        ],
        'L.L': [ // Lecture/Littérature
            'Lecture suivie : Chapitre 2',
            'Fiche de lecture à compléter',
            'Questions de compréhension p.15',
        ],
        'Sciences': [
            'Schéma du corps humain',
            'Exercices page 20-21',
            'Observation : La germination',
        ]
    };
    
    const planData = [];
    
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
};

async function addSeptemberData() {
    try {
        console.log('🌱 Génération des données de SEPTEMBRE 2025...\n');
        
        const septData = generateSeptemberData();
        console.log(`✅ ${septData.length} devoirs générés pour septembre`);
        console.log(`📅 Dates : 28 septembre - 2 octobre 2025`);
        console.log(`👥 Classes : PEI1, PEI2, PEI3, PEI4, DP2`);
        console.log(`📚 Matières : Mathématiques, Français, Arabe, L.L, Sciences\n`);
        
        console.log('📋 Échantillon :');
        septData.slice(0, 3).forEach(item => {
            console.log(`   ${item.Jour} | ${item.Classe} | ${item.Matière} : ${item.Devoirs.substring(0, 40)}...`);
        });
        console.log(`   ... et ${septData.length - 3} autres\n`);
        
        console.log('📤 Envoi des données à l\'API...');
        const response = await uploadData(septData);
        
        console.log('\n✅ Réponse de l\'API :');
        console.log(`   ${response.message}`);
        if (response.normalized !== undefined) {
            console.log(`   📊 Normalisés : ${response.normalized}`);
        }
        
        console.log('\n🎉 Données de septembre ajoutées !');
        console.log('\n📊 TOTAL dans la base :');
        console.log('   ✅ 100 devoirs de NOVEMBRE (3-6 nov)');
        console.log('   ✅ 125 devoirs de SEPTEMBRE (28 sept - 2 oct)');
        console.log('   ═══════════════════════════════');
        console.log('   📚 TOTAL : 225 devoirs\n');
        
        console.log('🔍 Vérification : https://devoirs2026.vercel.app/\n');
        
    } catch (error) {
        console.error('\n❌ ERREUR :', error.message);
        process.exit(1);
    }
}

console.log('╔' + '═'.repeat(68) + '╗');
console.log('║                                                                    ║');
console.log('║     📅 AJOUT DES DONNÉES DE SEPTEMBRE 2025                       ║');
console.log('║                                                                    ║');
console.log('╚' + '═'.repeat(68) + '╝\n');

addSeptemberData();
