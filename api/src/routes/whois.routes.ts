import { Router } from "express";
import { profilesRoutes } from './whois/profiles.routes';
import { partiesRoutes } from './whois/parties.routes';
import { boxResponsesRoutes } from './whois/boxResponses.routes';
import { boxesRoutes } from './whois/boxes.routes';
import { participantsRoutes } from "./whois/participants.routes";

const router = Router();

router.use('/profiles', profilesRoutes);
router.use('/parties', partiesRoutes);
router.use('/responses', boxResponsesRoutes);
router.use('/boxes', boxesRoutes);
router.use('/participants', participantsRoutes);

export { router as whoisRoutes };