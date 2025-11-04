const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = "mongodb+srv://medchelli24:Alkawthar1986@cluster0.5raqb.mongodb.net/devoirs?retryWrites=true&w=majority";
    
    try {
        console.log('🔌 Connexion à MongoDB...');
        const client = new MongoClient(uri);
        await client.connect();
        
        const db = client.db('devoirs');
        const collection = db.collection('plans');
        
        // Compter les documents
        const count = await collection.countDocuments();
        console.log(`📊 Nombre de devoirs dans la base : ${count}`);
        
        // Récupérer quelques documents
        const docs = await collection.find({}).limit(5).toArray();
        console.log('\n📝 Premiers documents :');
        docs.forEach(doc => {
            console.log(`   - Date: ${doc.Jour}, Classe: ${doc.Classe}, Enseignant: ${doc.Enseignant}`);
        });
        
        // Récupérer toutes les dates uniques
        const allDocs = await collection.find({}).toArray();
        const dates = [...new Set(allDocs.map(d => d.Jour))].sort();
        console.log(`\n📅 Dates présentes dans la base (${dates.length}) :`);
        dates.forEach(date => {
            const count = allDocs.filter(d => d.Jour === date).length;
            console.log(`   - ${date} : ${count} devoirs`);
        });
        
        await client.close();
        console.log('\n✅ Test terminé');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

testConnection();
