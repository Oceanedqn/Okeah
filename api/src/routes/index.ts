import { Router } from 'express';
// import { getUsers } from '../controllers/users.controller';

import { authRoutes } from './auth.routes';
import { usersRoutes } from './users.routes';
import { whoisRoutes } from './whois.routes';


const router = Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes utilisateurs
router.use('/users', usersRoutes);

// Router pour WHOIS
router.use('/whois', whoisRoutes);

export default router;