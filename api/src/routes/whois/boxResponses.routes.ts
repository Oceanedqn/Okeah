import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { get_box_response_async, create_box_response_async } from "../../controllers/whois/boxResponses.controller";



const router = Router();

router.post('/', authenticate, create_box_response_async)
router.get('/box/:id_box', authenticate, get_box_response_async)
// router.put('/:id_party/participants/completed/random', authenticate, update_box_response_async)

export { router as boxResponsesRoutes };