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
        // AJOUT : Récupérer la liste de toutes les matières
        const subjects = await collection.distinct("Matière", { "Matière": { $exists: true, $ne: null, $ne: "" } });
        
        res.status(200).json({ teachers, classes, subjects }); // AJOUT : Renvoyer les matières
    } catch (error) {
        console.error("[initial-data] ERREUR:", error);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};```

---

### **Étape 2 : Mettre à jour `api/evaluations.js`**

C'est une modification cruciale. Nous devons maintenant lier chaque évaluation non seulement à un élève et une date, mais aussi à une **matière spécifique**.

**Remplacez le contenu de `api/evaluations.js` :**
```javascript
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('test');
        const { class: className, student: studentName, date: dateQuery, week } = req.query;

        if (req.method === 'POST') {
            const { evaluations } = req.body;
            if (!evaluations || evaluations.length === 0) {
                return res.status(200).json({ message: 'Aucune évaluation à enregistrer.' });
            }
            const evaluationsCollection = db.collection('evaluations');
            const operations = evaluations.map(ev => ({
                updateOne: {
                    // CORRECTION : Le filtre inclut maintenant la matière pour une évaluation unique
                    filter: { date: ev.date, studentName: ev.studentName, class: ev.class, subject: ev.subject },
                    update: { $set: ev },
                    upsert: true
                }
            }));
            await evaluationsCollection.bulkWrite(operations);
            return res.status(200).json({ message: 'Évaluations enregistrées.' });
        }

        if (req.method === 'GET') {
            if (!className || !dateQuery) {
                return res.status(400).json({ error: 'Classe et date sont requises.' });
            }
            
            const planningCollection = db.collection('plans');
            const evaluationsCollection = db.collection('evaluations');

            const planningEntries = await planningCollection.find({
                Classe: className, 
                Jour: dateQuery,
            }).toArray();

            // CORRECTION : Inclure l'enseignant dans les données de devoirs pour le filtrage côté client
            const homeworks = planningEntries
                .filter(entry => entry.Devoirs && entry.Devoirs.trim() !== "")
                .map(entry => ({ 
                    subject: entry.Matière, 
                    assignment: entry.Devoirs, 
                    teacher: entry.Enseignant // AJOUT IMPORTANT
                }));
            
            let query = { class: className, date: dateQuery };
            if (studentName) {
                query.studentName = studentName;
            }
            const evaluations = await evaluationsCollection.find(query).toArray();
            
            let responseData = { homeworks, evaluations };

            if (week === 'true' && studentName) {
                const targetDate = new Date(dateQuery + 'T00:00:00Z');
                const dayOfWeek = targetDate.getUTCDay();
                const firstDayOfWeek = new Date(targetDate);
                firstDayOfWeek.setUTCDate(targetDate.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() + 6);

                const firstDayStr = firstDayOfWeek.toISOString().split('T')[0];
                const lastDayStr = lastDayOfWeek.toISOString().split('T')[0];
                
                responseData.weeklyEvaluations = await evaluationsCollection.find({
                    studentName: studentName,
                    class: className,
                    date: { $gte: firstDayStr, $lte: lastDayStr }
                }).toArray();
            }
            return res.status(200).json(responseData);
        }
        
        return res.status(405).json({ message: 'Méthode non autorisée' });

    } catch (error) {
        console.error("[evaluations] ERREUR:", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
};
