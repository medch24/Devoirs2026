const express = require('express');
const path = require('path');
const apiHandler = require('./api/index.js'); // Importe votre logique actuelle

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques (votre HTML, CSS, JS client)
// Assurez-vous que vos fichiers index.html, script.js sont dans un dossier nommé 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rediriger toutes les requêtes /api/* vers votre handler existant
app.all('/api/*', async (req, res) => {
    try {
        await apiHandler(req, res);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Railway définit automatiquement la variable d'environnement PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
