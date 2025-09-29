const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('plans');
        
        // CORRECTION : Renvoyer toutes les données du planning
        // Cela permet au front-end de construire les filtres dynamiques.
        const planData = await collection.find({}).toArray();
        
        // On extrait aussi les listes uniques pour le remplissage initial
        const teachers = [...new Set(planData.map(item => item.Enseignant))].sort();
        
        res.status(200).json({ teachers, planData });
    } catch (error) {
        console.error("[initial-data] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
