const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
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
