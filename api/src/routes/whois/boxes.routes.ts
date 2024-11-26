import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { get_today_box_async, get_today_box_in_game_async, get_past_boxes_in_game_async } from "../../controllers/whois/boxes.controller";


const router = Router();

router.get('/:id_party/today', authenticate, get_today_box_async)
router.get('/:id_party/today/game', authenticate, get_today_box_in_game_async)
router.get('/:id_party/before', authenticate, get_past_boxes_in_game_async)

export { router as boxesRoutes };