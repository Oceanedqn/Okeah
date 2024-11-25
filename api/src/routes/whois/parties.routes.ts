import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { create_party_async, get_participants_async, get_party_async, get_user_parties_async, get_user_parties_finished_async, join_party_async, get_parties_async } from "../../controllers/whois/parties.controller";



const router = Router();

router.post('/', authenticate, create_party_async);
router.get('/user/parties', authenticate, get_user_parties_async)
router.get('/user/parties/finished', authenticate, get_user_parties_finished_async)
router.get('/', authenticate, get_parties_async)
router.post('/join', authenticate, join_party_async)
router.get('/:id_party/participants', authenticate, get_participants_async)
// router.get('/:id_party/participants/number', authenticate, get_participants_number_async)
router.get('/:id_party', authenticate, get_party_async)
// router.get('/:id_party/participants/completed', authenticate, get_participants_completed_async)
// router.get('/:id_party/participants/completed/random', authenticate, get_participants_completed_random_async)

export { router as partiesRoutes };