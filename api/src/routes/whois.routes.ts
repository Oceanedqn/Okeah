import { Router } from "express";
import { profilesRoutes } from './whois/profiles.routes';
import { partiesRoutes } from './whois/parties.routes';
import { boxResponsesRoutes } from './whois/boxResponses.routes';
import { boxesRoutes } from './whois/boxes.routes';

const router = Router();

router.use('/parties/profiles', profilesRoutes);
router.use('/parties', partiesRoutes);
router.use('/boxResponses', boxResponsesRoutes);
router.use('/boxes', boxesRoutes);

export { router as whoisRoutes };