import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


pool.on('connect', () => {
    console.log('Connexion réussie à la base de données PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Erreur de connexion à PostgreSQL :', err);
});

export default pool;