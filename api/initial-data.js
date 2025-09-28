const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('plans');
        const teachers = await collection.distinct("Enseignant", { "Enseignant": { $ne: null, $ne: "" } });
        const classes = await collection.distinct("Classe", { "Classe": { $ne: null, $ne: "" } });
        res.status(200).json({ teachers, classes });
    } catch (error) {
        console.error("[initial-data] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
