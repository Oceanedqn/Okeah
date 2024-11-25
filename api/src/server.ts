import app from './app';
import pool from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}).on('error', (err) => {
    console.error(`Erreur lors du démarrage du serveur :`, err);
});

// Connexion à la base de données PostgreSQL
pool.connect()
    .then(() => {
        console.log('Connexion réussie à PostgreSQL');
    })
    .catch((err) => {
        console.error('Erreur de connexion à PostgreSQL', err);
    });