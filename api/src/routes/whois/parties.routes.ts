import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import {
    create_party_async,
    get_parties_by_user_async,
    get_finished_parties_by_user_async,
    get_unjoined_parties_async,
    get_party_by_id_async,
    join_party_async
} from "../../controllers/whois/parties.controller";



const router = Router();

router.post('/', authenticate, create_party_async);
router.get('/user/parties', authenticate, get_parties_by_user_async)
router.get('/user/parties/finished', authenticate, get_finished_parties_by_user_async)
router.get('/', authenticate, get_unjoined_parties_async)
router.post('/join', authenticate, join_party_async)
router.get('/:id_party', authenticate, get_party_by_id_async)

export { router as partiesRoutes };