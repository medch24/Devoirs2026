const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    // La logique de ce fichier ne change pas, seule la syntaxe
    try {
        const db = client.db('test');
        // ... (le reste de la logique pour GET et POST reste identique)
    } catch (error) {
        // ...
    }
};
