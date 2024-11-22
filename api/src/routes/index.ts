import { Router } from 'express';
// import { getUsers } from '../controllers/users.controller';

import { authRoutes } from './auth.routes';
import { usersRoutes } from './users.routes';
import { profilesRoutes } from './whois/profiles.routes';
import { partiesRoutes } from './whois/parties.routes';
import { boxResponsesRoutes } from './whois/boxResponses.routes';
import { boxesRoutes } from './whois/boxes.routes';

const router = Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes utilisateurs
router.use('/users', usersRoutes);

// Router pour WHOIS
router.use('/whois/profiles', profilesRoutes);
router.use('/whois/parties', partiesRoutes);
router.use('/whois/boxResponses', boxResponsesRoutes);
router.use('/whois/boxes', boxesRoutes);

export default router;