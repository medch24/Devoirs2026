const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
        const { class: className, student: studentName, date: dateQuery, week } = req.query;

        if (req.method === 'POST') {
            // La logique POST reste la même
            const { evaluations } = req.body;
            const evaluationsCollection = db.collection('evaluations');
            const operations = evaluations.map(ev => ({
                updateOne: { filter: { date: ev.date, studentName: ev.studentName }, update: { $set: { ...ev } }, upsert: true }
            }));
            if (operations.length > 0) await evaluationsCollection.bulkWrite(operations);
            return res.status(200).json({ message: 'Évaluations enregistrées.' });
        }

        if (req.method === 'GET') {
            // --- DÉBUT DU BLOC DE DIAGNOSTIC ---
            console.log(`--- REQUÊTE GET REÇUE ---`);
            console.log(`Critère Classe: "${className}"`);
            console.log(`Critère Jour: "${dateQuery}"`);

            if (!className || !dateQuery) return res.status(400).json({ error: 'Classe et date requises.' });
            
            const planningCollection = db.collection('plans');
            const evaluationsCollection = db.collection('evaluations');

            const query = {
                Classe: className, 
                Jour: dateQuery,
            };

            console.log("Exécution de la requête:", JSON.stringify(query));
            const planningEntries = await planningCollection.find(query).toArray();
            console.log(`Requête terminée. ${planningEntries.length} devoirs trouvés.`);
            
            // Si on ne trouve rien, on lance une recherche plus large pour aider au diagnostic
            if (planningEntries.length === 0) {
                console.log("DIAGNOSTIC : La requête n'a rien retourné. Lancement d'une recherche plus large sur la date uniquement...");
                const diagnosticEntries = await planningCollection.find({ Jour: dateQuery }).toArray();
                if (diagnosticEntries.length > 0) {
                    console.log(`DIAGNOSTIC : Trouvé ${diagnosticEntries.length} entrées pour cette date. Exemple : Classe="${diagnosticEntries[0].Classe}"`);
                } else {
                    console.log(`DIAGNOSTIC : Aucune entrée trouvée pour la date "${dateQuery}" dans toute la collection.`);
                }
            }
            // --- FIN DU BLOC DE DIAGNOSTIC ---

            const homeworks = planningEntries
                .filter(entry => entry.Devoirs && entry.Devoirs.trim() !== "")
                .map(entry => ({ subject: entry.Matière, assignment: entry.Devoirs }));
            
            let evalsQuery = { class: className, date: dateQuery };
            if (studentName) evalsQuery.studentName = studentName;
            const evaluations = await evaluationsCollection.find(evalsQuery).toArray();
            
            let responseData = { homeworks, evaluations };

            if (week === 'true' && studentName) {
                // ... (la logique de la semaine ne change pas)
            }
            return res.status(200).json(responseData);
        }
    } catch (error) {
        console.error("[evaluations] ERREUR:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
};
