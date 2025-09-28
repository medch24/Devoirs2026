const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('plans');

        const planData = req.body;

        if (!planData || planData.length === 0) {
            return res.status(400).json({ message: 'Aucune donnée à enregistrer.' });
        }

        // Étape 1: Effacer l'ancien planning
        await collection.deleteMany({});

        // Étape 2: Insérer le nouveau planning
        await collection.insertMany(planData);

        res.status(200).json({ message: `Planning mis à jour avec ${planData.length} devoirs.` });

    } catch (error) {
        console.error("[upload-plan] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
