const { MongoClient } = require('mongodb');
const moment = require('moment');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
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

    } catch (error) {
        console.error("[evaluations] ERREUR:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
