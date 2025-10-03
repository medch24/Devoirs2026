const { MongoClient } = require('mongodb');
const moment = require('moment');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Fonction pour calculer les étoiles d'un élève
const calculateStars = (evaluations) => {
    const evalsByDay = {};
    evaluations.forEach(ev => {
        if (!evalsByDay[ev.date]) evalsByDay[ev.date] = [];
        evalsByDay[ev.date].push(ev);
    });

    let stars = 0;
    for (const date in evalsByDay) {
        const dayEvals = evalsByDay[date];
        const allDone = dayEvals.every(ev => ev.status === 'Fait');
        const goodBehavior = dayEvals.every(ev => (ev.behavior || 0) >= 5);
        const goodParticipation = dayEvals.every(ev => (ev.participation || 0) >= 5);

        if (allDone && goodBehavior && goodParticipation) {
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
        const plansCollection = db.collection('plans');

        // Définir la semaine scolaire : du dimanche précédent au jeudi précédent
        const today = moment().startOf('day');
        const startOfWeek = today.clone().day(0); // Dimanche
        const endOfWeek = today.clone().day(4);   // Jeudi

        const dateQuery = {
            $gte: startOfWeek.format('YYYY-MM-DD'),
            $lte: endOfWeek.format('YYYY-MM-DD'),
        };

        const allEvals = await evaluationsCollection.find({ date: dateQuery }).toArray();

        if (allEvals.length === 0) {
            return res.status(200).json({}); // Pas d'élève de la semaine
        }

        const evalsByStudent = {};
        allEvals.forEach(ev => {
            if (!evalsByStudent[ev.studentName]) {
                evalsByStudent[ev.studentName] = { evals: [], class: ev.class };
            }
            evalsByStudent[ev.studentName].evals.push(ev);
        });

        let studentOfTheWeek = null;
        let maxStars = 0;

        for (const studentName in evalsByStudent) {
            const studentInfo = evalsByStudent[studentName];
            const stars = calculateStars(studentInfo.evals);

            if (stars >= 4 && stars > maxStars) {
                maxStars = stars;
                studentOfTheWeek = {
                    name: studentName,
                    class: studentInfo.class,
                    stars: maxStars
                };
            }
        }

        res.status(200).json(studentOfTheWeek || {});

    } catch (error) {
        console.error("[weekly-summary] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
};
