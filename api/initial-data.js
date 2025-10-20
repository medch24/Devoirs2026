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
    try {
        const client = await connectToDatabase();
        const db = client.db('devoirs');
        const collection = db.collection('plans');
        
        // Renvoyer toutes les données du planning pour construire les filtres
        const planData = await collection.find({}).toArray();
        
        // Extraire la liste unique des enseignants
        const teachers = [...new Set(planData.map(item => item.Enseignant).filter(Boolean))].sort();
        
        res.status(200).json({ teachers, planData });
    } catch (error) {
        console.error("[initial-data] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
