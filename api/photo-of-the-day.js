const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('settings');
        
        const photoSettingId = "photo_of_the_day";

        if (req.method === 'POST') {
            const { imageUrl } = req.body;
            
            // Sécurité simple pour l'admin
            const { username, password } = req.headers;
            if (username !== 'Mohamed86' || password !== 'Mohamed86') {
                return res.status(401).json({ error: 'Non autorisé' });
            }

            if (typeof imageUrl !== 'string') {
                return res.status(400).json({ error: 'URL invalide' });
            }

            await collection.updateOne(
                { _id: photoSettingId },
                { $set: { url: imageUrl } },
                { upsert: true }
            );
            return res.status(200).json({ message: 'Photo mise à jour avec succès.' });
        }

        if (req.method === 'GET') {
            const setting = await collection.findOne({ _id: photoSettingId });
            return res.status(200).json({ url: setting ? setting.url : null });
        }
        
        return res.status(405).json({ message: 'Méthode non autorisée' });

    } catch (error) {
        console.error("[photo-of-the-day] ERREUR:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
};
