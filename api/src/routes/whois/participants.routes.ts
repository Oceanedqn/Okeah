import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import {
    get_participants_async,
    get_participants_completed_async
} from "../../controllers/whois/participants.controller";



const router = Router();


router.get('/:id_party', authenticate, get_participants_async)
// router.get('/:id_party/number', authenticate, get_participants_number_async)
router.get('/:id_party/completed', authenticate, get_participants_completed_async)
// router.get('/:id_party/completed/random', authenticate, get_participants_completed_random_async)

export { router as participantsRoutes };