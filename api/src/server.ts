import app from './app';
import pool from './config/database';
import dotenv from 'dotenv';
import { IUser } from '../src/interfaces/IUser';


dotenv.config();

// declare global {
//     namespace Express {
//         interface Request {
//             user?: IUser;  // Déclarez la propriété user comme étant de type IUser (ou tout autre type approprié)
//         }
//     }
// }

const PORT = process.env.PORT || 8000;


app.get('/', (req, res) => {
    res.send('Hello, world!');
});


// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}).on('error', (err) => {
    console.error(`Erreur lors du démarrage du serveur :`, err);
});



// Connexion db
pool.connect()
    .then(() => {
        console.log('Connexion réussie à PostgreSQL');
    })
    .catch((err) => {
        console.error('Erreur de connexion à PostgreSQL', err);
    });