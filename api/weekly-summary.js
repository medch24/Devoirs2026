const { MongoClient } = require('mongodb');
const moment = require('moment');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

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
        await client.connect();
        const db = client.db('test');
        const evaluationsCollection = db.collection('evaluations');
        const dailyStarsCollection = db.collection('daily_stars');

        // Définir la semaine scolaire : du dimanche précédent au jeudi précédent
        const today = moment().startOf('day');
        const startOfWeek = today.clone().day(0); // Dimanche
        const endOfWeek = today.clone().day(4);   // Jeudi

        const dateQuery = {
            $gte: startOfWeek.format('YYYY-MM-DD'),
            $lte: endOfWeek.format('YYYY-MM-DD'),
        };

        // First, try to get stars from the daily_stars collection
        const dailyStars = await dailyStarsCollection.find({ date: dateQuery }).toArray();
        
        let studentOfTheWeek = null;
        let maxStars = 0;
        
        if (dailyStars.length > 0) {
            // Use persistent daily star records
            const starsByStudent = {};
            
            dailyStars.forEach(starRecord => {
                if (!starsByStudent[starRecord.studentName]) {
                    starsByStudent[starRecord.studentName] = {
                        stars: 0,
                        class: starRecord.className,
                        dailyRecords: []
                    };
                }
                if (starRecord.earnedStar) {
                    starsByStudent[starRecord.studentName].stars++;
                }
                starsByStudent[starRecord.studentName].dailyRecords.push(starRecord);
            });

            // Find student with most stars (minimum 4 for "student of the week")
            for (const studentName in starsByStudent) {
                const studentInfo = starsByStudent[studentName];
                if (studentInfo.stars >= 4 && studentInfo.stars > maxStars) {
                    maxStars = studentInfo.stars;
                    studentOfTheWeek = {
                        name: studentName,
                        class: studentInfo.class,
                        stars: maxStars,
                        dailyRecords: studentInfo.dailyRecords
                    };
                }
            }
        } else {
            // Fallback to legacy evaluation-based calculation
            const allEvals = await evaluationsCollection.find({ date: dateQuery }).toArray();
            
            if (allEvals.length > 0) {
                const evalsByStudent = {};
                allEvals.forEach(ev => {
                    if (!evalsByStudent[ev.studentName]) {
                        evalsByStudent[ev.studentName] = { evals: [], class: ev.class };
                    }
                    evalsByStudent[ev.studentName].evals.push(ev);
                });

                for (const studentName in evalsByStudent) {
                    const studentInfo = evalsByStudent[studentName];
                    const stars = calculateStarsLegacy(studentInfo.evals);

                    if (stars >= 4 && stars > maxStars) {
                        maxStars = stars;
                        studentOfTheWeek = {
                            name: studentName,
                            class: studentInfo.class,
                            stars: maxStars,
                            method: 'legacy'
                        };
                    }
                }
            }
        }

        res.status(200).json(studentOfTheWeek || {});

    } catch (error) {
        console.error("[weekly-summary] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    } finally {
        await client.close();
    }
};
