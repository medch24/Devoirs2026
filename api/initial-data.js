const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    // D'après votre URI, le nom de la base de données est "Alkawthar1"
    return client.db('test'); 
}

module.exports = async (req, res) => {
    try {
        const db = await connectToDatabase();
        // IMPORTANT: Remplacez 'PlanHebdomadaire' par le nom EXACT de votre collection
        const planningCollection = db.collection('plans');

        // Utiliser .distinct() pour obtenir des listes uniques, en filtrant les valeurs nulles
        const teachers = await planningCollection.distinct("Enseignant", { "Enseignant": { $ne: null } });
        const classes = await planningCollection.distinct("Classe", { "Classe": { $ne: null } });

        res.status(200).json({ teachers, classes });

    } catch (error) {
        console.error("Erreur API (initial-data):", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
