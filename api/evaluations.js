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
                    filter: { date: ev.date, studentName: ev.studentName, class: ev.class }, // Ajout de 'class' pour un filtre plus précis
                    update: { $set: { ...ev } },
                    upsert: true
                }
            }));
            if (operations.length > 0) await evaluationsCollection.bulkWrite(operations);
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
                .map(entry => ({ subject: entry.Matière, assignment: entry.Devoirs }));
            
            let query = { class: className, date: dateQuery };
            if (studentName) query.studentName = studentName;
            const evaluations = await evaluationsCollection.find(query).toArray();
            
            let responseData = { homeworks, evaluations };

            if (week === 'true' && studentName) {
                const targetDate = moment.utc(dateQuery); // Utiliser moment.utc pour éviter les problèmes de fuseau horaire
                const dayOfWeek = targetDate.isoWeekday(); // Lundi=1, Dimanche=7
                
                // Début de semaine (lundi)
                const firstDayOfWeek = targetDate.clone().isoWeekday(1);
                // Fin de semaine (dimanche)
                const lastDayOfWeek = targetDate.clone().isoWeekday(7);

                const firstDayStr = firstDayOfWeek.format('YYYY-MM-DD');
                const lastDayStr = lastDayOfWeek.format('YYYY-MM-DD');
                
                responseData.weeklyEvaluations = await evaluationsCollection.find({
                    studentName: studentName,
                    class: className, // Ajout de la classe pour filtrer les évaluations de la semaine
                    date: { $gte: firstDayStr, $lte: lastDayStr }
                }).toArray();
            }
            return res.status(200).json(responseData);
        }
    } catch (error) {
        console.error("[evaluations] ERREUR:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
