import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";


const router = Router();

// router.get('/id_party.today', authenticate, read_today_box_async)
// router.get('/:id_party/today/game', authenticate, read_today_box_in_game_async)
// router.get('/:id_party/before', authenticate, read_before_box_async)
// router.post('/:id_party/today', authenticate, create_box_async)

export { router as boxesRoutes };