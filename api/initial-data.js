const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('plans');
        const teachers = await collection.distinct("Enseignant", { "Enseignant": { $exists: true, $ne: null, $ne: "" } });
        const classes = await collection.distinct("Classe", { "Classe": { $exists: true, $ne: null, $ne: "" } });
        const subjects = await collection.distinct("Matière", { "Matière": { $exists: true, $ne: null, $ne: "" } });
        
        res.status(200).json({ teachers, classes, subjects });
    } catch (error) {
        console.error("[initial-data] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
