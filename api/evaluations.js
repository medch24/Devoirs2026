const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    // IMPORTANT : Assurez-vous que "Alkawthar1" est le nom de votre base de données.
    // D'après votre URI, il semble que ce soit le cas.
    return client.db('Alkawthar1'); 
}

// Helper pour obtenir le nom du mois en français
const mois = ["Janv", "Févr", "Mars", "Avril", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

module.exports = async (req, res) => {
    try {
        const db = await connectToDatabase();
        
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
            if (operations.length > 0) {
                await evaluationsCollection.bulkWrite(operations);
            }
            return res.status(200).json({ message: 'Évaluations enregistrées.' });

        } else if (req.method === 'GET') {
            const { class: className, student: studentName, date: dateQuery, week } = req.query;

            if (!className || !dateQuery) {
                return res.status(400).json({ error: 'Classe et date requises.' });
            }

            // --- NOUVELLE LOGIQUE DE RECHERCHE CORRIGÉE ---
            
            // IMPORTANT : Remplacez 'PlanHebdomadaire' par le nom exact de votre collection !
            const planningCollection = db.collection('PlanHebdomadaire'); 
            const evaluationsCollection = db.collection('evaluations');

            // 1. On crée une expression de recherche flexible pour la date.
            const dateObj = new Date(dateQuery);
            const jour = dateObj.getDate(); // ex: 24
            const nomMois = mois[dateObj.getMonth()]; // ex: "Sept"
            const annee = dateObj.getFullYear(); // ex: 2025
            
            // On cherche un texte qui contient le jour ET le mois ET l'année.
            const dateRegex = new RegExp(`${jour}.*${nomMois}.*${annee}`, 'i');

            // 2. On exécute la recherche avec les bons critères.
            const planningEntries = await planningCollection.find({
                Classe: new RegExp(className, 'i'),
                Jour: dateRegex, // Utilisation de la recherche flexible
                Devoirs: { $exists: true, $nin: [null, ""] }
            }).toArray();

            // 3. On formate les résultats pour le frontend.
            const homeworks = planningEntries.map(entry => ({
                subject: entry.Matière,
                assignment: entry.Devoirs
            }));
            
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
