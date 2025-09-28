const { MongoClient } = require('mongodb');

// URI de connexion stockée en variable d'environnement sur Vercel
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    // Vérifie si la connexion n'est pas déjà établie
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    return client.db('AlkawtharDB'); // Vous pouvez nommer votre base de données
}

// Handler principal pour les requêtes Vercel
module.exports = async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        // Gérer les requêtes POST (soumission des évaluations par l'enseignant)
        if (req.method === 'POST') {
            const { evaluations } = req.body;
            if (!evaluations || !Array.isArray(evaluations)) {
                return res.status(400).json({ message: 'Le format des évaluations est incorrect.' });
            }
            const evaluationsCollection = db.collection('evaluations');
            const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

            const operations = evaluations.map(ev => ({
                updateOne: {
                    filter: { 
                        date: today, 
                        studentName: ev.studentName,
                        subject: ev.subject 
                    },
                    update: { $set: { ...ev, date: today } },
                    upsert: true
                }
            }));

            if (operations.length > 0) {
                await evaluationsCollection.bulkWrite(operations);
            }
            
            return res.status(200).json({ message: 'Évaluations enregistrées avec succès.' });
        
        // Gérer les requêtes GET (récupération des données pour le parent)
        } else if (req.method === 'GET') {
            const { class: className, student: studentName } = req.query;

            if (!className || !studentName) {
                return res.status(400).json({ error: 'Classe et nom de l´élève requis.' });
            }

            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(today.getDate() - 5);
            const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0];

            const homeworkCollection = db.collection('homeworks');
            const evaluationsCollection = db.collection('evaluations');
            
            const todayHomework = await homeworkCollection.find({
                class: className,
                date: todayStr
            }).toArray();

            const pastEvaluations = await evaluationsCollection.find({
                studentName: studentName,
                date: { $gte: fiveDaysAgoStr, $lt: todayStr }
            }).sort({ date: -1 }).toArray();
            
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1)); // Lundi comme début de semaine
            const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
            
            const weeklyEvals = await evaluationsCollection.find({
                studentName: studentName,
                date: { $gte: startOfWeekStr }
            }).toArray();
            
            let totalScore = 0;
            let maxScore = 0;
            if (weeklyEvals.length > 0) {
                weeklyEvals.forEach(ev => {
                    totalScore += ev.status === 'Fait' ? 10 : ev.status === 'Partiellement Fait' ? 5 : 0;
                    totalScore += ev.participation + ev.behavior;
                    maxScore += 30;
                });
            }
            const weeklyProgress = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
            
            return res.status(200).json({ todayHomework, pastEvaluations, weeklyProgress });

        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error("Erreur API:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
