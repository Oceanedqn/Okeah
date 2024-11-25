import express, { Application } from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';

// Charger les variables d'environnement
dotenv.config();

const app: Application = express();

// Configuration de multer pour gérer les fichiers téléchargés
const upload = multer({
    storage: multer.memoryStorage(),  // Enregistrer en mémoire pour une gestion des fichiers plus flexible
    limits: { fileSize: 50 * 1024 * 1024 },  // Limite de taille des fichiers à 50 MB
});

// Middleware
app.use(express.json({ limit: '50mb' }));  // Limite de taille des données JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' }));  // Limite de taille des données URL encodées
app.use(cookieParser());  // Pour gérer les cookies
app.use(cors({ origin: ['http://localhost:3000', 'https://okeah.vercel.app'], credentials: true }));  // Configuration CORS pour autoriser l'accès depuis le front-end

// Routes
app.use('/api', routes);

// Exporter l'application pour l'utiliser dans d'autres fichiers
export default app;