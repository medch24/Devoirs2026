const { MongoClient } = require('mongodb');
const moment = require('moment');

// ============================================================================
// SHARED DATABASE CONNECTION (avec cache pour réutilisation)
// ============================================================================
let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }

    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Calculate if a student deserves a star for a given day
// Returns: 1 (full star), 0.5 (half star), or 0 (no star)
const calculateDailyStar = (evaluations) => {
    if (!evaluations || evaluations.length === 0) return 0;
    
    const completedHomework = evaluations.filter(ev => ev.status === 'Fait').length;
    const partiallyCompleted = evaluations.filter(ev => ev.status === 'Partiellement Fait').length;
    
    const hasGoodParticipation = evaluations.every(ev => (ev.participation || 0) > 5);
    const hasGoodBehavior = evaluations.every(ev => (ev.behavior || 0) > 5);
    
    // 1 étoile: tous les devoirs faits + comportement/participation > 5
    if (completedHomework === evaluations.length && hasGoodParticipation && hasGoodBehavior) {
        return 1;
    }
    
    // 0.5 étoile: au moins la moitié des devoirs faits ou partiellement faits + notes >= 5
    const halfOrMore = (completedHomework + partiallyCompleted) >= (evaluations.length / 2);
    if (halfOrMore && hasGoodParticipation && hasGoodBehavior) {
        return 0.5;
    }
    
    return 0;
};

// Calculate stars from daily records
const calculateStarsFromDailyRecords = (dailyStarRecords) => {
    return dailyStarRecords.filter(record => record.earnedStar).length;
};

// Fallback function for calculating stars from evaluations (legacy support)
const calculateStarsLegacy = (evaluations) => {
    const evalsByDay = {};
    evaluations.forEach(ev => {
        if (!evalsByDay[ev.date]) evalsByDay[ev.date] = [];
        evalsByDay[ev.date].push(ev);
    });

    let stars = 0;
    for (const date in evalsByDay) {
        const dayEvals = evalsByDay[date];
        
        const completedHomework = dayEvals.filter(ev => 
            ev.status === 'Fait' || ev.status === 'Partiellement Fait'
        ).length;
        const completionRate = (completedHomework / dayEvals.length) * 100;
        
        const hasGoodCompletion = completionRate > 70;
        const goodBehavior = dayEvals.every(ev => (ev.behavior || 0) > 5);
        const goodParticipation = dayEvals.every(ev => (ev.participation || 0) > 5);

        if (hasGoodCompletion && goodBehavior && goodParticipation) {
            stars++;
        }
    }
    return stars;
};

// ============================================================================
// API HANDLERS
// ============================================================================

// Handler: /api/evaluations
async function handleEvaluations(req, res) {
    const client = await connectToDatabase();
    const db = client.db('devoirs');
    const { class: className, student: studentName, date: dateQuery, week } = req.query;

    if (req.method === 'POST') {
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
    }
    
    return res.status(405).json({ message: 'Méthode non autorisée' });
}

// Handler: /api/weekly-summary
async function handleWeeklySummary(req, res) {
    const client = await connectToDatabase();
    const db = client.db('devoirs');
    const evaluationsCollection = db.collection('evaluations');
    const dailyStarsCollection = db.collection('daily_stars');
    const studentsOfWeekCollection = db.collection('students_of_the_week');

    const today = moment().startOf('day');
    const dayOfWeek = today.day(); // 0 = Dimanche
    
    let targetWeekStart, targetWeekEnd;
    
    // Afficher uniquement le dimanche (jour 0) et le lundi (jour 1) - soit 2 jours
    if (dayOfWeek === 0 || dayOfWeek === 1) { // Dimanche ou Lundi
        // Si dimanche, on prend la semaine précédente
        // Si lundi, on prend aussi la semaine précédente (pour continuité)
        targetWeekStart = today.clone().subtract(7, 'days').day(0);
        targetWeekEnd = today.clone().subtract(7, 'days').day(4);
    } else {
        return res.status(200).json({ studentsOfWeek: [], showDisplay: false, message: 'Élève de la semaine affiché uniquement dimanche et lundi' });
    }

    const dateQuery = {
        $gte: targetWeekStart.format('YYYY-MM-DD'),
        $lte: targetWeekEnd.format('YYYY-MM-DD'),
    };

    const weekIdentifier = targetWeekStart.format('YYYY-[W]WW');
    const existingStudentsOfWeek = await studentsOfWeekCollection.find({ weekIdentifier }).toArray();
    
    if (existingStudentsOfWeek.length > 0) {
        return res.status(200).json({ 
            studentsOfWeek: existingStudentsOfWeek, 
            showDisplay: true,
            isLastWeek: true 
        });
    }

    const dailyStars = await dailyStarsCollection.find({ date: dateQuery }).toArray();
    const allEvals = await evaluationsCollection.find({ date: dateQuery }).toArray();
    
    const studentsByClass = {};
    
    if (dailyStars.length > 0) {
        dailyStars.forEach(starRecord => {
            const classKey = starRecord.className;
            if (!studentsByClass[classKey]) {
                studentsByClass[classKey] = {};
            }
            if (!studentsByClass[classKey][starRecord.studentName]) {
                studentsByClass[classKey][starRecord.studentName] = {
                    stars: 0,
                    dailyRecords: [],
                    progressPercentage: 0
                };
            }
            if (starRecord.earnedStar) {
                studentsByClass[classKey][starRecord.studentName].stars++;
            }
            studentsByClass[classKey][starRecord.studentName].dailyRecords.push(starRecord);
        });
    } else {
        allEvals.forEach(ev => {
            const classKey = ev.class;
            if (!studentsByClass[classKey]) {
                studentsByClass[classKey] = {};
            }
            if (!studentsByClass[classKey][ev.studentName]) {
                studentsByClass[classKey][ev.studentName] = {
                    evals: [],
                    class: ev.class
                };
            }
            studentsByClass[classKey][ev.studentName].evals.push(ev);
        });
    }

    for (const classKey in studentsByClass) {
        const students = studentsByClass[classKey];
        for (const studentName in students) {
            const studentData = students[studentName];
            
            const studentEvals = allEvals.filter(ev => 
                ev.class === classKey && ev.studentName === studentName
            );
            
            let totalScore = 0;
            let maxScore = 0;
            
            studentEvals.forEach(ev => {
                const dayOfWeek = moment(ev.date).day();
                if (dayOfWeek >= 0 && dayOfWeek <= 4 && ev.status !== 'Absent') {
                    totalScore += (ev.status === 'Fait' ? 10 : ev.status === 'Partiellement Fait' ? 5 : 0) + 
                                  (ev.participation || 0) + (ev.behavior || 0);
                    maxScore += 30;
                }
            });
            
            studentData.progressPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
            
            if (!studentData.stars && studentData.evals) {
                studentData.stars = calculateStarsLegacy(studentData.evals);
            }
        }
    }

    // MODIFICATION: Sélectionner UN SEUL élève de toutes les classes (celui avec le plus d'étoiles)
    let topStudentOverall = null;
    let topStarsOverall = -1;
    let previousWeekStars = {}; // Pour calculer la progression
    
    // Récupérer les étoiles de la semaine précédente pour calculer la progression
    const previousWeekStart = targetWeekStart.clone().subtract(7, 'days');
    const previousWeekEnd = targetWeekEnd.clone().subtract(7, 'days');
    const previousWeekQuery = {
        $gte: previousWeekStart.format('YYYY-MM-DD'),
        $lte: previousWeekEnd.format('YYYY-MM-DD'),
    };
    const previousDailyStars = await dailyStarsCollection.find({ date: previousWeekQuery }).toArray();
    
    // Calculer les étoiles de la semaine précédente par étudiant
    previousDailyStars.forEach(starRecord => {
        const key = `${starRecord.studentName}_${starRecord.className}`;
        if (!previousWeekStars[key]) {
            previousWeekStars[key] = 0;
        }
        previousWeekStars[key] += (starRecord.earnedStar || 0);
    });
    
    for (const classKey in studentsByClass) {
        const students = studentsByClass[classKey];
        
        for (const studentName in students) {
            const studentData = students[studentName];
            const stars = studentData.stars || 0;
            const progress = studentData.progressPercentage || 0;
            
            // Critère: au moins 3 étoiles et progression > 79%
            if (stars >= 3 && progress > 79) {
                // On cherche celui avec le PLUS d'étoiles de toutes les classes
                if (stars > topStarsOverall) {
                    topStarsOverall = stars;
                    
                    // Calculer le commentaire de progression
                    const previousStarsKey = `${studentName}_${classKey}`;
                    const previousStars = previousWeekStars[previousStarsKey] || 0;
                    let progressComment = { fr: 'Excellent', ar: 'ممتاز' };
                    
                    if (stars > previousStars) {
                        progressComment = { fr: 'En amélioration', ar: 'في تحسن' };
                    } else if (stars < previousStars) {
                        progressComment = { fr: 'En régression', ar: 'في تراجع' };
                    }
                    
                    topStudentOverall = {
                        name: studentName,
                        class: classKey,
                        stars: stars,
                        progressPercentage: progress,
                        progressComment: progressComment,
                        weekIdentifier: weekIdentifier,
                        startDate: targetWeekStart.format('YYYY-MM-DD'),
                        endDate: targetWeekEnd.format('YYYY-MM-DD'),
                        createdAt: new Date()
                    };
                }
            }
        }
    }

    const studentsOfWeek = topStudentOverall ? [topStudentOverall] : [];
    
    if (studentsOfWeek.length > 0) {
        await studentsOfWeekCollection.insertMany(studentsOfWeek);
    }

    res.status(200).json({ 
        studentsOfWeek, 
        showDisplay: true,
        isLastWeek: true 
    });
}

// Handler: /api/daily-stars
async function handleDailyStars(req, res) {
    const client = await connectToDatabase();
    const db = client.db('devoirs');
    const evaluationsCollection = db.collection('evaluations');
    const dailyStarsCollection = db.collection('daily_stars');
    
    if (req.method === 'GET') {
        const { studentName, className, date, week } = req.query;
        
        let query = {};
        if (studentName) query.studentName = studentName;
        if (className) query.className = className;
        if (date) query.date = date;
        
        if (week) {
            const today = moment().startOf('day');
            const startOfWeek = today.clone().day(0);
            const endOfWeek = today.clone().day(4);
            
            query.date = {
                $gte: startOfWeek.format('YYYY-MM-DD'),
                $lte: endOfWeek.format('YYYY-MM-DD'),
            };
        }
        
        const stars = await dailyStarsCollection.find(query).toArray();
        res.status(200).json({ stars });
        
    } else if (req.method === 'POST') {
        const { date } = req.body;
        const targetDate = date || moment().format('YYYY-MM-DD');
        
        const evaluations = await evaluationsCollection.find({ date: targetDate }).toArray();
        
        if (evaluations.length === 0) {
            return res.status(200).json({ message: 'No evaluations found for this date', date: targetDate });
        }
        
        const evalsByStudent = {};
        evaluations.forEach(ev => {
            const key = `${ev.studentName}_${ev.class}`;
            if (!evalsByStudent[key]) {
                evalsByStudent[key] = {
                    studentName: ev.studentName,
                    className: ev.class,
                    evaluations: []
                };
            }
            evalsByStudent[key].evaluations.push(ev);
        });
        
        const dailyStars = [];
        
        for (const key in evalsByStudent) {
            const studentData = evalsByStudent[key];
            const earnedStar = calculateDailyStar(studentData.evaluations);
            
            // Calculate earned star (now can be 0, 0.5, or 1)
            const earnedStarValue = calculateDailyStar(studentData.evaluations);
            
            const starRecord = {
                date: targetDate,
                studentName: studentData.studentName,
                className: studentData.className,
                earnedStar: earnedStarValue,
                evaluationCount: studentData.evaluations.length,
                completionRate: studentData.evaluations.length > 0 
                    ? Math.round((studentData.evaluations.filter(ev => 
                        ev.status === 'Fait' || ev.status === 'Partiellement Fait'
                      ).length / studentData.evaluations.length) * 100)
                    : 0,
                avgParticipation: studentData.evaluations.length > 0
                    ? Math.round(studentData.evaluations.reduce((sum, ev) => sum + (ev.participation || 0), 0) / studentData.evaluations.length * 10) / 10
                    : 0,
                avgBehavior: studentData.evaluations.length > 0
                    ? Math.round(studentData.evaluations.reduce((sum, ev) => sum + (ev.behavior || 0), 0) / studentData.evaluations.length * 10) / 10
                    : 0,
                createdAt: new Date()
            };
            
            await dailyStarsCollection.updateOne(
                { 
                    date: targetDate, 
                    studentName: studentData.studentName, 
                    className: studentData.className 
                },
                { $set: starRecord },
                { upsert: true }
            );
            
            dailyStars.push(starRecord);
        }
        
        res.status(200).json({ 
            message: `Processed ${dailyStars.length} student records for ${targetDate}`,
            date: targetDate,
            stars: dailyStars
        });
        
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

// Handler: /api/photo-of-the-day
async function handlePhotoOfTheDay(req, res) {
    const client = await connectToDatabase();
    const db = client.db('devoirs');
    const collection = db.collection('photos_of_the_day');
    
    if (req.method === 'POST') {
        const { imageUrl, comment } = req.body;
        
        const { username, password } = req.headers;
        if (username !== 'Mohamed86' || password !== 'Mohamed86') {
            return res.status(401).json({ error: 'Non autorisé' });
        }

        if (typeof imageUrl !== 'string' || !imageUrl) {
            return res.status(400).json({ error: 'URL invalide' });
        }

        await collection.insertOne({
            url: imageUrl,
            comment: comment || "",
            createdAt: new Date()
        });
        return res.status(200).json({ message: 'Photo ajoutée avec succès.' });
    }

    if (req.method === 'GET') {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        await collection.deleteMany({ createdAt: { $lt: threeDaysAgo } });
        
        const latestPhoto = await collection.find().sort({ createdAt: -1 }).limit(1).toArray();
        const photoData = latestPhoto.length > 0 ? latestPhoto[0] : {};
        return res.status(200).json(photoData);
    }
    
    return res.status(405).json({ message: 'Méthode non autorisée' });
}

// Handler: /api/photo-2
async function handlePhoto2(req, res) {
    const client = await connectToDatabase();
    const db = client.db('devoirs');
    const collection = db.collection('photos_celebration_2');
    
    if (req.method === 'POST') {
        const { imageUrl, comment } = req.body;
        
        const { username, password } = req.headers;
        if (username !== 'Mohamed86' || password !== 'Mohamed86') {
            return res.status(401).json({ error: 'Non autorisé' });
        }

        if (typeof imageUrl !== 'string' || !imageUrl) {
            return res.status(400).json({ error: 'URL invalide' });
        }

        await collection.insertOne({
            url: imageUrl,
            comment: comment || "Une autre belle réussite à célébrer !",
            createdAt: new Date()
        });
        return res.status(200).json({ message: 'Photo de célébration 2 ajoutée avec succès.' });
    }

    if (req.method === 'GET') {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        await collection.deleteMany({ createdAt: { $lt: threeDaysAgo } });
        
        const latestPhoto = await collection.find().sort({ createdAt: -1 }).limit(1).toArray();
        const photoData = latestPhoto.length > 0 ? latestPhoto[0] : {};
        return res.status(200).json(photoData);
    }
    
    return res.status(405).json({ message: 'Méthode non autorisée' });
}

// Handler: /api/photo-3
async function handlePhoto3(req, res) {
    const client = await connectToDatabase();
    const db = client.db('devoirs');
    const collection = db.collection('photos_celebration_3');
    
    if (req.method === 'POST') {
        const { imageUrl, comment } = req.body;
        
        const { username, password } = req.headers;
        if (username !== 'Mohamed86' || password !== 'Mohamed86') {
            return res.status(401).json({ error: 'Non autorisé' });
        }

        if (typeof imageUrl !== 'string' || !imageUrl) {
            return res.status(400).json({ error: 'URL invalide' });
        }

        await collection.insertOne({
            url: imageUrl,
            comment: comment || "Un accomplissement remarquable !",
            createdAt: new Date()
        });
        return res.status(200).json({ message: 'Photo de célébration 3 ajoutée avec succès.' });
    }

    if (req.method === 'GET') {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        await collection.deleteMany({ createdAt: { $lt: threeDaysAgo } });
        
        const latestPhoto = await collection.find().sort({ createdAt: -1 }).limit(1).toArray();
        const photoData = latestPhoto.length > 0 ? latestPhoto[0] : {};
        return res.status(200).json(photoData);
    }
    
    return res.status(405).json({ message: 'Méthode non autorisée' });
}

// Handler: /api/upload-plan
async function handleUploadPlan(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const client = await connectToDatabase();
    const db = client.db('devoirs');
    const collection = db.collection('plans');

    const planData = req.body;

    if (!planData || planData.length === 0) {
        return res.status(400).json({ message: 'Aucune donnée à enregistrer.' });
    }

    const operations = planData.map(plan => ({
        updateOne: {
            filter: { Jour: plan.Jour, Classe: plan.Classe, Matière: plan.Matière },
            update: { $set: plan },
            upsert: true
        }
    }));

    if (operations.length > 0) {
        await collection.bulkWrite(operations);
    }

    res.status(200).json({ message: `Planning mis à jour avec ${planData.length} enregistrements.` });
}

// Handler: /api/initial-data
async function handleInitialData(req, res) {
    const client = await connectToDatabase();
    const db = client.db('devoirs');
    const collection = db.collection('plans');
    
    const planData = await collection.find({}).toArray();
    const teachers = [...new Set(planData.map(item => item.Enseignant).filter(Boolean))].sort();
    
    res.status(200).json({ teachers, planData });
}

// ============================================================================
// MAIN ROUTER
// ============================================================================
module.exports = async (req, res) => {
    try {
        // Parse l'URL pour déterminer la route
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        // Router basé sur le pathname
        if (pathname === '/api/evaluations' || pathname === '/api/evaluations/') {
            await handleEvaluations(req, res);
        } else if (pathname === '/api/weekly-summary' || pathname === '/api/weekly-summary/') {
            await handleWeeklySummary(req, res);
        } else if (pathname === '/api/daily-stars' || pathname === '/api/daily-stars/') {
            await handleDailyStars(req, res);
        } else if (pathname === '/api/photo-of-the-day' || pathname === '/api/photo-of-the-day/') {
            await handlePhotoOfTheDay(req, res);
        } else if (pathname === '/api/photo-2' || pathname === '/api/photo-2/') {
            await handlePhoto2(req, res);
        } else if (pathname === '/api/photo-3' || pathname === '/api/photo-3/') {
            await handlePhoto3(req, res);
        } else if (pathname === '/api/upload-plan' || pathname === '/api/upload-plan/') {
            await handleUploadPlan(req, res);
        } else if (pathname === '/api/initial-data' || pathname === '/api/initial-data/') {
            await handleInitialData(req, res);
        } else if (pathname === '/api' || pathname === '/api/') {
            // Route par défaut pour /api
            res.status(200).json({ 
                message: 'API Devoirs2026',
                version: '1.0.0',
                endpoints: [
                    '/api/evaluations',
                    '/api/weekly-summary',
                    '/api/daily-stars',
                    '/api/photo-of-the-day',
                    '/api/photo-2',
                    '/api/photo-3',
                    '/api/upload-plan',
                    '/api/initial-data'
                ]
            });
        } else {
            res.status(404).json({ error: 'API endpoint not found' });
        }

    } catch (error) {
        console.error("[API] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
