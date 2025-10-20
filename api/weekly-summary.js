const { MongoClient } = require('mongodb');
const moment = require('moment');

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

// Enhanced function to calculate stars using the persistent daily star system
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
        
        // New criteria: >70% completion + participation>5 + behavior>5
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

module.exports = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const db = client.db('devoirs');
        const evaluationsCollection = db.collection('evaluations');
        const dailyStarsCollection = db.collection('daily_stars');
        const studentsOfWeekCollection = db.collection('students_of_the_week');

        // Définir la semaine scolaire : du dimanche précédent au jeudi précédent
        const today = moment().startOf('day');
        const dayOfWeek = today.day(); // 0 = Dimanche
        
        // Si c'est dimanche, on affiche l'élève de la semaine dernière
        // Sinon on n'affiche rien (seulement le dimanche)
        let targetWeekStart, targetWeekEnd;
        
        if (dayOfWeek === 0) { // Dimanche
            // Afficher l'élève de la semaine dernière (dimanche-jeudi précédents)
            targetWeekStart = today.clone().subtract(7, 'days').day(0); // Dimanche de la semaine dernière
            targetWeekEnd = today.clone().subtract(7, 'days').day(4);   // Jeudi de la semaine dernière
        } else {
            // Pas dimanche, ne rien afficher
            return res.status(200).json({ studentsOfWeek: [], showDisplay: false, message: 'Élève de la semaine affiché uniquement le dimanche' });
        }

        const dateQuery = {
            $gte: targetWeekStart.format('YYYY-MM-DD'),
            $lte: targetWeekEnd.format('YYYY-MM-DD'),
        };

        // Check if we already have students of the week for this week
        const weekIdentifier = targetWeekStart.format('YYYY-[W]WW');
        const existingStudentsOfWeek = await studentsOfWeekCollection.find({ weekIdentifier }).toArray();
        
        // If we have existing records, return them with showDisplay flag
        if (existingStudentsOfWeek.length > 0) {
            return res.status(200).json({ 
                studentsOfWeek: existingStudentsOfWeek, 
                showDisplay: true,
                isLastWeek: true 
            });
        }

        // Calculate students of the week for each class
        const dailyStars = await dailyStarsCollection.find({ date: dateQuery }).toArray();
        const allEvals = await evaluationsCollection.find({ date: dateQuery }).toArray();
        
        const studentsByClass = {};
        
        // Group by class
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
            // Fallback to evaluation-based calculation
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

        // Calculate progress percentage for each student
        for (const classKey in studentsByClass) {
            const students = studentsByClass[classKey];
            for (const studentName in students) {
                const studentData = students[studentName];
                
                // Get student's evaluations for this week
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
                
                // Calculate stars if not already done
                if (!studentData.stars && studentData.evals) {
                    studentData.stars = calculateStarsLegacy(studentData.evals);
                }
            }
        }

        // Select student of the week for each class
        // CRITÈRES: Au moins 3 étoiles ET plus de 79% d'avancement
        const studentsOfWeek = [];
        
        for (const classKey in studentsByClass) {
            const students = studentsByClass[classKey];
            let topStudent = null;
            let topScore = -1;
            
            for (const studentName in students) {
                const studentData = students[studentName];
                const stars = studentData.stars || 0;
                const progress = studentData.progressPercentage || 0;
                
                // CRITÈRES OBLIGATOIRES: >= 3 étoiles ET > 79% de progression
                if (stars >= 3 && progress > 79) {
                    // Combined score: stars (weighted 70%) + progress (weighted 30%)
                    const combinedScore = (stars * 20) + (progress * 0.3);
                    
                    if (combinedScore > topScore) {
                        topScore = combinedScore;
                        topStudent = {
                            name: studentName,
                            class: classKey,
                            stars: stars,
                            progressPercentage: progress,
                            weekIdentifier: weekIdentifier,
                            startDate: targetWeekStart.format('YYYY-MM-DD'),
                            endDate: targetWeekEnd.format('YYYY-MM-DD'),
                            createdAt: new Date()
                        };
                    }
                }
            }
            
            if (topStudent) {
                studentsOfWeek.push(topStudent);
            }
        }

        // Save students of the week to database
        if (studentsOfWeek.length > 0) {
            await studentsOfWeekCollection.insertMany(studentsOfWeek);
        }

        res.status(200).json({ 
            studentsOfWeek, 
            showDisplay: true,
            isLastWeek: true 
        });

    } catch (error) {
        console.error("[weekly-summary] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
