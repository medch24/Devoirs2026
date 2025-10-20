const { MongoClient } = require('mongodb');

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }

    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    try {
        const client = await connectToDatabase();
        const db = client.db('devoirs');
        const collection = db.collection('plans');

        const planData = req.body;

        if (!planData || planData.length === 0) {
            return res.status(400).json({ message: 'Aucune donnée à enregistrer.' });
        }

        // CORRECTION MAJEURE : Remplacer deleteMany/insertMany par une opération de mise à jour/insertion (upsert)
        // Cela permet de conserver les anciennes données et de ne mettre à jour que les nouvelles.
        const operations = planData.map(plan => ({
            updateOne: {
                // Le filtre unique pour un devoir est la combinaison de Jour, Classe, et Matière.
                filter: { Jour: plan.Jour, Classe: plan.Classe, Matière: plan.Matière },
                update: { $set: plan }, // Met à jour toutes les données du devoir
                upsert: true // Crée le devoir s'il n'existe pas
            }
        }));

        if (operations.length > 0) {
            await collection.bulkWrite(operations);
        }

        res.status(200).json({ message: `Planning mis à jour avec ${planData.length} enregistrements.` });

    } catch (error) {
        console.error("[upload-plan] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    } finally {
        // La connexion client doit être fermée après chaque exécution pour éviter les fuites de connexion
        if (client) {
            await client.close();
        }
    }
};
