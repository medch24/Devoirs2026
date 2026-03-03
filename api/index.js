const { MongoClient } = require('mongodb');
const moment = require('moment');
const crypto = require('crypto');

// ============================================================================
// SHARED DATABASE CONNECTION (avec cache pour réutilisation)
// ============================================================================
let cachedClient = null;
let cachedDb = null;
let cachedDbName = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    // Support multiple env var names to avoid deployment misconfigurations
    const uri = process.env.MONGODB_URI
        || process.env.MONGODB_ATLAS_URI
        || process.env.MONGODB_URL
        || process.env.MONGO_URI
        || process.env.MONGODB_REAL_URI
        || process.env.MONGODB_TEST_URI;
    
    if (!uri) {
        console.warn('[MongoDB] Missing MongoDB connection string. Retrying with fallback...');
        throw new Error('Missing MongoDB connection string. Please set MONGODB_URI in Vercel Environment Variables.');
    }

    try {
        const client = new MongoClient(uri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        await client.connect();
        cachedClient = client;

        // Determine database name: env var > URI path > default
        const match = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/i);
        const dbFromUri = match && match[1] ? match[1] : null;
        cachedDbName = process.env.MONGODB_DB_NAME || dbFromUri || 'devoirs';

        console.log(`[MongoDB] Connected successfully to database: ${cachedDbName}`);
        return client;
    } catch (error) {
        console.error('[MongoDB] Connection failed:', error.message);
        throw error;
    }
}

async function getDb() {
    const client = await connectToDatabase();
    if (cachedDb) return cachedDb;

    // Preferred DB
    let dbName = cachedDbName || 'devoirs';
    let db = client.db(dbName);

    try {
        const hasPlans = await db.listCollections({ name: 'plans' }).hasNext();
        if (hasPlans) {
            cachedDb = db;
            console.log(`[MongoDB] Using database: ${dbName}`);
            return cachedDb;
        }
    } catch (_) {}

    // Smart fallbacks: common names used in this project/cluster
    const candidates = ['test', 'devoirs2026', 'devoirs'];
    for (const name of candidates) {
        if (name === dbName) continue;
        try {
            const candidateDb = client.db(name);
            const ok = await candidateDb.listCollections({ name: 'plans' }).hasNext();
            if (ok) {
                cachedDbName = name;
                cachedDb = candidateDb;
                console.log(`[MongoDB] Switched to database: ${name}`);
                return cachedDb;
            }
        } catch (_) { /* ignore */ }
    }

    // If nothing found, keep the initial db
    cachedDb = db;
    return cachedDb;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Ensure JSON body is parsed for POST/PUT requests in all runtimes
 */
async function readJsonBody(req) {
    if (req.body && typeof req.body === 'object') return req.body;
    return await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
            try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
        });
        req.on('error', () => resolve({}));
    });
}

/**
 * 🔢 Convertir les chiffres arabes en chiffres latins
 */
function convertArabicToLatin(str) {
    const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
    const latinNumerals = '0123456789';
    let result = str;
    for (let i = 0; i < 10; i++) {
        result = result.replace(new RegExp(arabicNumerals[i], 'g'), latinNumerals[i]);
    }
    return result;
}

// ============================================================================
// API HANDLERS - WITH ERROR HANDLING
// ============================================================================

// Handler: /api/evaluations - IMPROVED WITH ERROR HANDLING
async function handleEvaluations(req, res) {
    try {
        const db = await getDb();
        const { class: className, student: studentName, date: dateQuery, week } = req.query;

        if (req.method === 'POST') {
            if (!req.body || typeof req.body !== 'object') { req.body = await readJsonBody(req); }
            const { evaluations } = req.body;
            if (!evaluations || evaluations.length === 0) {
                return res.status(200).json({ message: 'Aucune évaluation à enregistrer.' });
            }
            const evaluationsCollection = db.collection('evaluations');
            const operations = evaluations.map(ev => ({
                updateOne: {
                    filter: { date: ev.date, studentName: ev.studentName, class: ev.class, subject: ev.subject },
                    update: { $set: ev },
                    upsert: true
                }
            }));
            await evaluationsCollection.bulkWrite(operations);
            return res.status(200).json({ message: 'Évaluations enregistrées.' });
        }

        if (req.method === 'GET') {
            if (!className || !dateQuery) {
                return res.status(400).json({ error: 'Classe et date sont requises.' });
            }
            
            const planningCollection = db.collection('plans');
            const evaluationsCollection = db.collection('evaluations');

            try {
                const planningEntries = await planningCollection.find({
                    Classe: className, 
                    Jour: dateQuery,
                }).toArray();

                const homeworks = planningEntries
                    .filter(entry => entry.Devoirs && entry.Devoirs.trim() !== "")
                    .map(entry => ({ 
                        subject: entry.Matière, 
                        assignment: entry.Devoirs, 
                        teacher: entry.Enseignant
                    }));
                
                let query = { class: className, date: dateQuery };
                if (studentName) {
                    query.studentName = studentName;
                }
                const evaluations = await evaluationsCollection.find(query).toArray();
                
                let responseData = { homeworks, evaluations };

                if (week === 'true' && studentName) {
                    const targetDate = moment.utc(dateQuery);
                    const firstDayOfWeek = targetDate.clone().startOf('isoWeek');
                    const lastDayOfWeek = targetDate.clone().endOf('isoWeek');

                    const firstDayStr = firstDayOfWeek.format('YYYY-MM-DD');
                    const lastDayStr = lastDayOfWeek.format('YYYY-MM-DD');
                    
                    responseData.weeklyEvaluations = await evaluationsCollection.find({
                        studentName: studentName,
                        class: className,
                        date: { $gte: firstDayStr, $lte: lastDayStr }
                    }).toArray();
                }
                return res.status(200).json(responseData);
            } catch (dbError) {
                console.error('[API] Database error in evaluations:', dbError.message);
                // Return empty data instead of error to prevent UI crash
                return res.status(200).json({ 
                    homeworks: [], 
                    evaluations: [],
                    weeklyEvaluations: [],
                    warning: 'Données temporairement indisponibles'
                });
            }
        }
        
        return res.status(405).json({ message: 'Méthode non autorisée' });
    } catch (error) {
        console.error('[API] Evaluations error:', error);
        res.status(500).json({ 
            error: 'Erreur de chargement des données',
            homeworks: [],
            evaluations: [],
            weeklyEvaluations: []
        });
    }
}

// Handler: /api/initial-data - IMPROVED
async function handleInitialData(req, res) {
    try {
        const db = await getDb();
        const planningCollection = db.collection('plans');
        
        try {
            const planData = await planningCollection.find({}).toArray();
            return res.status(200).json({ planData: planData || [] });
        } catch (dbError) {
            console.error('[API] Database error in initial-data:', dbError.message);
            return res.status(200).json({ planData: [] });
        }
    } catch (error) {
        console.error('[API] Initial data error:', error);
        res.status(500).json({ planData: [], error: error.message });
    }
}

// Handler: /api/general-evaluations - IMPROVED
async function handleGeneralEvaluations(req, res) {
    try {
        const db = await getDb();
        const { student: studentName, class: className } = req.query;

        if (!studentName || !className) {
            return res.status(400).json({ error: 'Étudiant et classe sont requises.' });
        }

        try {
            const evaluationsCollection = db.collection('evaluations');
            const evaluations = await evaluationsCollection.find({
                studentName: studentName,
                class: className
            }).toArray();

            const stats = {
                totalEvaluations: evaluations.length,
                average: evaluations.length > 0 
                    ? (evaluations.reduce((sum, e) => sum + (parseFloat(e.score) || 0), 0) / evaluations.length).toFixed(2)
                    : 0,
                trends: {
                    improving: evaluations.filter(e => e.trend === 'في_تحسن').length,
                    stable: evaluations.filter(e => e.trend === 'stable').length,
                    declining: evaluations.filter(e => e.trend === 'في_تراجع').length
                }
            };

            return res.status(200).json({ evaluations, stats });
        } catch (dbError) {
            console.error('[API] Database error in general-evaluations:', dbError.message);
            return res.status(200).json({ 
                evaluations: [], 
                stats: { totalEvaluations: 0, average: 0, trends: { improving: 0, stable: 0, declining: 0 } }
            });
        }
    } catch (error) {
        console.error('[API] General evaluations error:', error);
        res.status(500).json({ 
            evaluations: [],
            stats: { totalEvaluations: 0, average: 0, trends: { improving: 0, stable: 0, declining: 0 } }
        });
    }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        if (pathname === '/api/evaluations' || pathname === '/api/evaluations/') {
            await handleEvaluations(req, res);
        } else if (pathname === '/api/initial-data' || pathname === '/api/initial-data/') {
            await handleInitialData(req, res);
        } else if (pathname === '/api/general-evaluations' || pathname === '/api/general-evaluations/') {
            await handleGeneralEvaluations(req, res);
        } else if (pathname === '/api' || pathname === '/api/') {
            // Route par défaut pour /api
            res.status(200).json({ 
                message: 'API Devoirs2026 - FIXED',
                version: '2.2.0',
                status: 'OK',
                endpoints: [
                    '/api/evaluations',
                    '/api/initial-data',
                    '/api/general-evaluations'
                ]
            });
        } else {
            res.status(404).json({ error: 'API endpoint not found' });
        }
    } catch (error) {
        console.error("[API] ERREUR GLOBALE:", error);
        res.status(500).json({ 
            error: 'Erreur interne du serveur',
            message: error.message,
            homeworks: [],
            evaluations: [],
            weeklyEvaluations: []
        });
    }
};
