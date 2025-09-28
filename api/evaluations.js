const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    return client.db('AlkawtharDB'); // Assurez-vous que le nom de la base de données est correct
}

module.exports = async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        if (req.method === 'POST') {
            // La logique pour ENREGISTRER les évaluations ne change pas.
            const { evaluations } = req.body;
            const evaluationsCollection = db.collection('evaluations');
            
            const operations = evaluations.map(ev => ({
                updateOne: {
                    filter: { date: ev.date, studentName: ev.studentName, subject: ev.subject }, // On ajoute le sujet pour plus de précision
                    update: { $set: { ...ev } },
                    upsert: true
                }
            }));
            if (operations.length > 0) {
                await evaluationsCollection.bulkWrite(operations);
            }
            return res.status(200).json({ message: 'Évaluations enregistrées.' });

        } else if (req.method === 'GET') {
            const { class: className, student: studentName, date: dateQuery, week } = req.query;

            if (!className || !dateQuery) {
                return res.status(400).json({ error: 'Classe et date requises.' });
            }

            // --- NOUVELLE LOGIQUE POUR LIRE LE PLANNING HEBDOMADAIRE ---

            // NOTE IMPORTANTE: Changez 'weekly_plans' par le nom exact de votre collection dans MongoDB
            const planningCollection = db.collection('weekly_plans'); 
            const evaluationsCollection = db.collection('evaluations');

            // 1. On cherche les devoirs dans le planning pour la classe et la date données.
            const planningEntries = await planningCollection.find({
                Classe: new RegExp(className, 'i'), // 'i' pour ignorer la casse (ex: "DP2" trouvera "DP2 Garçons")
                Jour: dateQuery,
                Devoirs: { $exists: true, $nin: [null, ""] } // On ne prend que les lignes où un devoir est écrit
            }).toArray();

            // 2. On transforme les données du planning au format que le site comprend.
            const homeworks = planningEntries.map(entry => ({
                subject: entry.Matière,
                assignment: entry.Devoirs,
                teacher: entry.Enseignant // On peut garder le nom de l'enseignant pour plus tard
            }));

            // --- Le reste de la logique ne change presque pas ---
            
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

                const weeklyEvaluations = await evaluationsCollection.find({
                    studentName: studentName,
                    date: { $gte: firstDayStr, $lte: lastDayStr }
                }).toArray();
                responseData.weeklyEvaluations = weeklyEvaluations;
            }

            return res.status(200).json(responseData);
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error("Erreur API:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
