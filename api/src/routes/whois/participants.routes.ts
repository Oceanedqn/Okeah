import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import {
    get_participant_by_id_async,
    get_participants_async,
    get_participants_completed_async,
    get_participants_with_scores_async,
    get_random_participants_completed_async,
    get_responses_participants_in_percentages_async
} from "../../controllers/whois/participants.controller";



const router = Router();


router.get('/:id_party', authenticate, get_participants_async)
router.get('/:id_party/scores', authenticate, get_participants_with_scores_async)
router.get('/:id_party/completed', authenticate, get_participants_completed_async)
router.get('/:id_party/completed/random', authenticate, get_random_participants_completed_async)
router.get('/:id_party/user/:id_user', authenticate, get_participant_by_id_async)
router.get('/:id_party/:id_box/percentages', authenticate, get_responses_participants_in_percentages_async)

export { router as participantsRoutes };