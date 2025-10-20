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
        // Collection pour stocker les photos de célébration 2
        const collection = db.collection('photos_celebration_2');
        
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
                comment: comment || "Une autre belle réussite à célébrer !",
                createdAt: new Date()
            });
            return res.status(200).json({ message: 'Photo de célébration 2 ajoutée avec succès.' });
        }

        if (req.method === 'GET') {
            // Auto-delete photos older than 3 days
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            await collection.deleteMany({ createdAt: { $lt: threeDaysAgo } });
            
            // Récupère la photo la plus récente
            const latestPhoto = await collection.find().sort({ createdAt: -1 }).limit(1).toArray();
            const photoData = latestPhoto.length > 0 ? latestPhoto[0] : {};
            return res.status(200).json(photoData);
        }
        
        return res.status(405).json({ message: 'Méthode non autorisée' });

    } catch (error) {
        console.error("[photo-2] ERREUR:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};