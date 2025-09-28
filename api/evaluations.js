import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const mois = ["Janv", "Févr", "Mars", "Avril", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

export default async function handler(req, res) {
    console.log(`[evaluations] Fonction démarrée pour la date: ${req.query.date} et la classe: ${req.query.class}`);
    
    // On ignore les requêtes pour le favicon qui peuvent polluer les logs
    if (req.url.includes('favicon.ico')) {
        return res.status(204).send();
    }

    try {
        await client.connect();
        console.log("[evaluations] Connecté à MongoDB.");
        
        const db = client.db('test');
        const planningCollection = db.collection('plans');
        
        const { class: className, date: dateQuery } = req.query;
        if (!className || !dateQuery) {
            return res.status(400).json({ error: 'Classe et date requises.' });
        }

        const dateObj = new Date(dateQuery);
        const jour = dateObj.getDate();
        const nomMois = mois[dateObj.getMonth()];
        const annee = dateObj.getFullYear();
        const dateRegex = new RegExp(`${jour}.*${nomMois}.*${annee}`, 'i');
        
        const query = {
            Classe: new RegExp(className, 'i'),
            Jour: dateRegex,
            Devoirs: { $exists: true, $nin: [null, ""] }
        };
        console.log("[evaluations] Exécution de la requête sur la collection 'plans' avec les critères :", query);

        const planningEntries = await planningCollection.find(query).toArray();
        console.log(`[evaluations] Trouvé ${planningEntries.length} devoirs correspondants.`);

        if (planningEntries.length === 0) {
            console.warn("[evaluations] AVERTISSEMENT : Aucun devoir trouvé. Vérifiez que la date et le nom de la classe correspondent aux données.");
        }

        // Le reste de la logique pour les évaluations et la semaine reste inchangé
        const evaluationsCollection = db.collection('evaluations');
        let evaluationsQuery = { class: className, date: dateQuery };
        if (req.query.student) evaluationsQuery.studentName = req.query.student;
        const evaluations = await evaluationsCollection.find(evaluationsQuery).toArray();

        const homeworks = planningEntries.map(entry => ({ subject: entry.Matière, assignment: entry.Devoirs }));
        let responseData = { homeworks, evaluations };

        // ... (logique de la semaine) ...

        res.status(200).json(responseData);
        
    } catch (error) {
        console.error("[evaluations] ERREUR CATCH :", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
}
