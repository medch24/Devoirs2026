const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
        const { class: className, student: studentName, date: dateQuery, week } = req.query;

        if (req.method === 'POST') {
            const { evaluations } = req.body;
            const evaluationsCollection = db.collection('evaluations');
            const operations = evaluations.map(ev => ({
                updateOne: {
                    filter: { date: ev.date, studentName: ev.studentName, subject: ev.subject },
                    update: { $set: { ...ev } },
                    upsert: true
                }
            }));
            if (operations.length > 0) await evaluationsCollection.bulkWrite(operations);
            return res.status(200).json({ message: 'Évaluations enregistrées.' });
        }

        if (req.method === 'GET') {
            if (!className || !dateQuery) return res.status(400).json({ error: 'Classe et date requises.' });
            
            const planningCollection = db.collection('plans');
            const evaluationsCollection = db.collection('evaluations');

            const planningEntries = await planningCollection.find({
                Classe: new RegExp(className, 'i'),
                Jour: dateQuery, // Recherche directe sur la date formatée YYYY-MM-DD
                Devoirs: { $exists: true, $nin: [null, ""] }
            }).toArray();

            const homeworks = planningEntries.map(entry => ({ subject: entry.Matière, assignment: entry.Devoirs }));
            
            let query = { class: className, date: dateQuery };
            if (studentName) query.studentName = studentName;
            const evaluations = await evaluationsCollection.find(query).toArray();
            
            let responseData = { homeworks, evaluations };

            if (week === 'true' && studentName) {
                const targetDate = new Date(dateQuery);
                const dayOfWeek = targetDate.getUTCDay();
                const firstDayOfWeek = new Date(targetDate);
                firstDayOfWeek.setUTCDate(targetDate.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() + 6);
                const firstDayStr = firstDayOfWeek.toISOString().split('T')[0];
                const lastDayStr = lastDayOfWeek.toISOString().split('T')[0];
                responseData.weeklyEvaluations = await evaluationsCollection.find({
                    studentName: studentName,
                    date: { $gte: firstDayStr, $lte: lastDayStr }
                }).toArray();
            }
            return res.status(200).json(responseData);
        }

    } catch (error) {
        console.error("[evaluations] ERREUR:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
};
