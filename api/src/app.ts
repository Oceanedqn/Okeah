import express, { Application } from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json()); // Pour traiter les requêtes JSON
app.use(cookieParser()); // Pour gérer les cookies
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Assurez-vous que votre front-end peut accéder à l'API

// Routes
app.use('/api', routes);

export default app;