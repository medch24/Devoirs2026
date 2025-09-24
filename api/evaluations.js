const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    return client.db('AlkawtharDB');
}

module.exports = async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        if (req.method === 'POST') {
            const { evaluations } = req.body;
            const evaluationsCollection = db.collection('evaluations');
            
            const operations = evaluations.map(ev => ({
                updateOne: {
                    filter: { date: ev.date, studentName: ev.studentName },
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

            const homeworkCollection = db.collection('homeworks');
            const evaluationsCollection = db.collection('evaluations');
            
            const homeworks = await homeworkCollection.find({ class: className, date: dateQuery }).toArray();
            
            let query = { class: className, date: dateQuery };
            if (studentName) query.studentName = studentName;
            const evaluations = await evaluationsCollection.find(query).toArray();
            
            let responseData = { homeworks, evaluations };

            // Si la vue parent demande les données de la semaine
            if (week === 'true' && studentName) {
                const targetDate = new Date(dateQuery);
                const dayOfWeek = targetDate.getDay();
                const firstDayOfWeek = new Date(targetDate);
                firstDayOfWeek.setDate(targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Lundi

                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

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
