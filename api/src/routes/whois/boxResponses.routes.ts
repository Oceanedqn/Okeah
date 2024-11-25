import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";



const router = Router();

// router.post('/id_party', authenticate, create_box_response_async)
// router.get('/:id_party/participants/completed', authenticate, read_box_response_async)
// router.put('/:id_party/participants/completed/random', authenticate, update_box_response_async)

export { router as boxResponsesRoutes };