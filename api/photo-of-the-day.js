const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
        // MODIFICATION: Utilisation d'une nouvelle collection pour stocker plusieurs photos
        const collection = db.collection('photos_of_the_day');
        
        if (req.method === 'POST') {
            // MODIFICATION: Accepte maintenant une URL et un commentaire
            const { imageUrl, comment } = req.body;
            
            const { username, password } = req.headers;
            if (username !== 'Mohamed86' || password !== 'Mohamed86') {
                return res.status(401).json({ error: 'Non autorisé' });
            }

            if (typeof imageUrl !== 'string' || !imageUrl) {
                return res.status(400).json({ error: 'URL invalide' });
            }

            // MODIFICATION: Insère une nouvelle photo au lieu de la mettre à jour
            await collection.insertOne({
                url: imageUrl,
                comment: comment || "", // Ajoute le commentaire
                createdAt: new Date() // Ajoute une date pour le tri
            });
            return res.status(200).json({ message: 'Photo ajoutée avec succès.' });
        }

        if (req.method === 'GET') {
            // MODIFICATION: Récupère la photo la plus récente
            const latestPhoto = await collection.find().sort({ createdAt: -1 }).limit(1).toArray();
            const photoData = latestPhoto.length > 0 ? latestPhoto[0] : {};
            return res.status(200).json(photoData); // Renvoie l'objet photo complet (url, comment, etc.)
        }
        
        return res.status(405).json({ message: 'Méthode non autorisée' });

    } catch (error) {
        console.error("[photo-of-the-day] ERREUR:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
};
