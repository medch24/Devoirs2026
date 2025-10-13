const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
        // Collection pour stocker les photos de célébration 3
        const collection = db.collection('photos_celebration_3');
        
        if (req.method === 'POST') {
            // Accepte une URL et un commentaire
            const { imageUrl, comment } = req.body;
            
            const { username, password } = req.headers;
            if (username !== 'Mohamed86' || password !== 'Mohamed86') {
                return res.status(401).json({ error: 'Non autorisé' });
            }

            if (typeof imageUrl !== 'string' || !imageUrl) {
                return res.status(400).json({ error: 'URL invalide' });
            }

            // Insère une nouvelle photo
            await collection.insertOne({
                url: imageUrl,
                comment: comment || "Un accomplissement remarquable !",
                createdAt: new Date()
            });
            return res.status(200).json({ message: 'Photo de célébration 3 ajoutée avec succès.' });
        }

        if (req.method === 'GET') {
            // Récupère la photo la plus récente
            const latestPhoto = await collection.find().sort({ createdAt: -1 }).limit(1).toArray();
            const photoData = latestPhoto.length > 0 ? latestPhoto[0] : {};
            return res.status(200).json(photoData);
        }
        
        return res.status(405).json({ message: 'Méthode non autorisée' });

    } catch (error) {
        console.error("[photo-3] ERREUR:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    } finally {
        await client.close();
    }
};