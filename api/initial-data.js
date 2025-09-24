import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    console.log("[initial-data] Fonction démarrée.");

    try {
        await client.connect();
        console.log("[initial-data] Connecté à MongoDB.");

        const db = client.db('test');
        console.log("[initial-data] Base de données 'test' sélectionnée.");

        const collection = db.collection('plans');
        console.log("[initial-data] Collection 'plans' sélectionnée.");

        // On cherche les enseignants
        const teachers = await collection.distinct("Enseignant", { "Enseignant": { $ne: null, $ne: "" } });
        console.log(`[initial-data] Trouvé ${teachers.length} enseignants uniques.`);
        
        // On cherche les classes
        const classes = await collection.distinct("Classe", { "Classe": { $ne: null, $ne: "" } });
        console.log(`[initial-data] Trouvé ${classes.length} classes uniques.`);

        if (teachers.length === 0 && classes.length === 0) {
            console.error("[initial-data] ERREUR : Aucun enseignant ni classe trouvé. La requête ne correspond à aucune donnée.");
        }

        res.status(200).json({ teachers, classes });

    } catch (error) {
        console.error("[initial-data] ERREUR CATCH :", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
}
